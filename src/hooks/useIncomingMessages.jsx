import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useIncomingMessages = (onMessage) => {
  const { credentials } = useAuth();

  const pollMessages = useCallback(async () => {
    if (!credentials?.instanceId || !credentials?.apiKey) return;

    try {
      const response = await fetch(
        `/waInstance${credentials.instanceId}/ReceiveNotification/${credentials.apiKey}`
      );

      if (!response.ok) return;

      const data = await response.json();
      if (!data) return;

      // Обработка входящего сообщения
      if (
        data.body?.typeWebhook === 'incomingMessageReceived' &&
        data.body?.messageData?.typeMessage === 'textMessage'
      ) {
        const {
          body: {
            messageData: { textMessageData },
            senderData: { sender },
            timestamp,
          },
        } = data;

        // Извлекаем номер телефона из формата 1234567890@c.us
        const phoneNumber = sender.split('@')[0];

        onMessage({
          phoneNumber,
          text: textMessageData.textMessage,
          timestamp,
        });
      }

      // Удаляем уведомление
      if (data.receiptId) {
        await fetch(
          `/waInstance${credentials.instanceId}/DeleteNotification/${credentials.apiKey}/${data.receiptId}`,
          { method: 'DELETE' }
        );
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  }, [credentials, onMessage]);

  useEffect(() => {
    if (!credentials) return;

    const interval = setInterval(pollMessages, 5000);
    return () => clearInterval(interval);
  }, [credentials, pollMessages]);
};
