import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import EditChat from './EditChat';
import { useAuth } from '../contexts/AuthContext';
import { useColorMode } from '../contexts/ThemeContext';
import { whatsappApi } from '../api/whatsappApi';
import { useIncomingMessages } from '../hooks/useIncomingMessages';

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showChatList, setShowChatList] = useState(!isMobile);
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('whatsapp-chats');
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChat, setActiveChat] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const { credentials } = useAuth();
  const { mode } = useColorMode();

  // Сохраняем чаты при изменении
  useEffect(() => {
    localStorage.setItem('whatsapp-chats', JSON.stringify(chats));
  }, [chats]);

  // Восстанавливаем активный чат после перезагрузки
  useEffect(() => {
    const savedActiveChat = localStorage.getItem('whatsapp-active-chat');
    if (savedActiveChat) {
      const chatId = JSON.parse(savedActiveChat);
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setActiveChat(chat);
      }
    }
  }, [chats]);

  // Сохраняем активный чат при изменении
  useEffect(() => {
    if (activeChat) {
      localStorage.setItem('whatsapp-active-chat', JSON.stringify(activeChat.id));
    } else {
      localStorage.removeItem('whatsapp-active-chat');
    }
  }, [activeChat]);

  // Установка активного чата при изменении списка чатов
  useEffect(() => {
    if (chats.length > 0) {
      setActiveChat(chats[0]);
    }
  }, [chats]);

  const handleIncomingMessage = ({ phoneNumber, text, timestamp }) => {
    const date = new Date(timestamp * 1000);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.phoneNumber === phoneNumber);
      if (chatIndex === -1) return prevChats;

      const newChats = [...prevChats];
      const chat = { ...newChats[chatIndex] };
      chat.messages = [...chat.messages, { text, time, isSent: false, read: false }];
      chat.lastMessage = text;
      newChats[chatIndex] = chat;

      if (activeChat?.phoneNumber === phoneNumber) {
        setActiveChat(chat);
      }

      return newChats;
    });
  };

  useIncomingMessages(handleIncomingMessage);

  const handleSendMessage = async (text) => {
    if (!text.trim() || !credentials || !activeChat) return;

    const date = new Date();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      text: text.trim(),
      time,
      isSent: true,
      read: true
    };

    // Обновляем чат локально
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: text.trim()
        };
      }
      return chat;
    }));

    // Обновляем активный чат
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: text.trim()
    }));

    // Отправляем сообщение через API
    try {
      await whatsappApi.sendMessage(
        credentials.instanceId,
        credentials.apiKey,
        activeChat.phoneNumber,
        text.trim()
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const handleNewChat = () => {
    if (chats.length >= 5) {
      setError('Maximum number of chats reached (5)');
      return;
    }
    setEditDialogOpen(true);
  };

  const handleEditChat = (editedChat) => {
    setChats(prev => prev.map(chat => 
      chat.id === editedChat.id ? editedChat : chat
    ));
    if (activeChat?.id === editedChat.id) {
      setActiveChat(editedChat);
    }
  };

  const handleDeleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
  };

  const handleSaveNewChat = (newChat) => {
    setChats(prev => [...prev, newChat]);
    setActiveChat(newChat);
    setEditDialogOpen(false);
  };

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackClick = () => {
    setShowChatList(true);
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      bgcolor: 'background.default'
    }}>
      {(!isMobile || showChatList) && (
        <ChatList
          chats={chats}
          activeChat={activeChat}
          onChatClick={handleChatClick}
          onNewChat={handleNewChat}
          onEditChat={handleEditChat}
          onDeleteChat={handleDeleteChat}
          error={error}
          setError={setError}
        />
      )}
      {(!isMobile || !showChatList) && (
        <ChatWindow
          chat={activeChat}
          onSendMessage={handleSendMessage}
          onBackClick={handleBackClick}
          isMobile={isMobile}
          mode={mode}
        />
      )}
      <EditChat
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveNewChat}
        chats={chats}
      />
    </Box>
  );
};

export default ChatPage;
