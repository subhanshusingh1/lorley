export const setAccessToken = (token) => {
    document.cookie = `accessToken=${token}; path=/; secure; samesite=strict`; // Adjust based on your needs
  };
  
  export const setRefreshToken = (token) => {
    document.cookie = `refreshToken=${token}; path=/; secure; samesite=strict`; // Adjust based on your needs
  };
  
  // Optionally, create functions to get and remove tokens as well
  export const getAccessToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; accessToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  
  export const getRefreshToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; refreshToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  
  export const removeTokens = () => {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };
  