// Форматирование номера телефона
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length < 11) return null;
  return cleaned;
};

// Форматирование времени
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Валидация номера телефона
export const validatePhoneNumber = (phoneNumber) => {
  const cleaned = formatPhoneNumber(phoneNumber);
  if (!cleaned) return false;
  return cleaned.length >= 11 && cleaned.length <= 15;
};

// Сохранение в localStorage
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Загрузка из localStorage
export const loadFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};
