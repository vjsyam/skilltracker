// Centralized error handling utility
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText;
    return {
      message,
      status: error.response.status,
      type: 'server'
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Unable to connect to server. Please check your connection.',
      type: 'network'
    };
  } else {
    // Something else happened
    return {
      message: defaultMessage,
      type: 'client'
    };
  }
};

export const safeArrayAccess = (array, defaultValue = []) => {
  return Array.isArray(array) ? array : defaultValue;
};

export const safeLength = (array) => {
  return Array.isArray(array) ? array.length : 0;
};
