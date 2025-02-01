import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const whatsappApi = {
  sendMessage: async (instanceId, apiKey, phoneNumber, message) => {
    try {
      const response = await api.post(
        `/waInstance${instanceId}/sendMessage/${apiKey}`,
        {
          chatId: `${phoneNumber}@c.us`,
          message
        }
      );
      
      // Проверяем статус ответа
      if (response.status === 200 && response.data) {
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Invalid API response' };
    } catch (error) {
      console.error('Send message error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'API request failed' 
      };
    }
  },

  receiveNotification: async (instanceId, apiKey) => {
    try {
      const response = await api.get(
        `/waInstance${instanceId}/receiveNotification/${apiKey}`
      );
      
      if (response.status === 200 && response.data) {
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Invalid API response' };
    } catch (error) {
      console.error('Receive notification error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'API request failed' 
      };
    }
  },

  deleteNotification: async (instanceId, apiKey, receiptId) => {
    try {
      const response = await api.delete(
        `/waInstance${instanceId}/deleteNotification/${apiKey}/${receiptId}`
      );
      
      if (response.status === 200) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete notification' };
    } catch (error) {
      console.error('Delete notification error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'API request failed' 
      };
    }
  }
};