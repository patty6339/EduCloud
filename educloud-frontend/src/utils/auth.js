export const isLoggedIn = () => {
    return !!localStorage.getItem('token'); // Checks if a token exists
  };
  
  export const logout = () => {
    localStorage.removeItem('token'); // Removes the stored token
  };
  
  export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    // Assuming the token is a JWT, decode it to extract the user's role
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.role;
  };
  