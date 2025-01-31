const BASE_URL = 'https://api.green-api.com';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Неверный Instance ID или API Key');
    }
    if (response.status === 466) {
      throw new Error('WhatsApp не авторизован. Отсканируйте QR-код в личном кабинете Green API');
    }
    if (response.status === 429) {
      throw new Error('Слишком много запросов. Попробуйте позже');
    }
    throw new Error(data.message || 'Ошибка сервера');
  }

  return data;
};

const fetchWithTimeout = async (url, options = {}) => {
  const timeout = 10000; // 10 секунд
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return handleResponse(response);
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Превышено время ожидания ответа от сервера');
    }
    throw error;
  }
};

export const whatsappApi = {
  checkAuth: async (instanceId, apiKey) => {
    if (!instanceId || !apiKey) {
      throw new Error('Instance ID и API Key обязательны');
    }

    try {
      const response = await fetchWithTimeout(
        `${BASE_URL}/waInstance${instanceId}/getStateInstance/${apiKey}`
      );

      if (response.stateInstance === 'notAuthorized') {
        throw new Error('WhatsApp не авторизован. Отсканируйте QR-код в личном кабинете Green API');
      }

      if (response.stateInstance !== 'authorized') {
        throw new Error(`Неверный статус аккаунта: ${response.stateInstance}`);
      }

      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Ошибка подключения к серверу Green API. Проверьте подключение к интернету');
      }
      throw error;
    }
  },

  sendMessage: async (instanceId, apiKey, phoneNumber, message) => {
    if (!instanceId || !apiKey) {
      throw new Error('Instance ID и API Key обязательны');
    }

    if (!phoneNumber || !message) {
      throw new Error('Номер телефона и сообщение обязательны');
    }

    try {
      const response = await fetchWithTimeout(
        `${BASE_URL}/waInstance${instanceId}/sendMessage/${apiKey}`,
        {
          method: 'POST',
          body: JSON.stringify({
            chatId: `${phoneNumber}@c.us`,
            message
          })
        }
      );

      return response;
    } catch (error) {
      console.error('Send message error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Ошибка подключения к серверу Green API');
      }
      throw error;
    }
  },

  receiveNotification: async (instanceId, apiKey) => {
    if (!instanceId || !apiKey) {
      throw new Error('Instance ID и API Key обязательны');
    }

    try {
      const response = await fetchWithTimeout(
        `${BASE_URL}/waInstance${instanceId}/receiveNotification/${apiKey}`
      );

      return response;
    } catch (error) {
      console.error('Receive notification error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Ошибка подключения к серверу Green API');
      }
      throw error;
    }
  },

  deleteNotification: async (instanceId, apiKey, receiptId) => {
    if (!instanceId || !apiKey || !receiptId) {
      throw new Error('Instance ID, API Key и Receipt ID обязательны');
    }

    try {
      const response = await fetchWithTimeout(
        `${BASE_URL}/waInstance${instanceId}/deleteNotification/${apiKey}/${receiptId}`,
        {
          method: 'DELETE'
        }
      );

      return response;
    } catch (error) {
      console.error('Delete notification error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Ошибка подключения к серверу Green API');
      }
      throw error;
    }
  }
};
