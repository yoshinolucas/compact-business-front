
import api from "./api";

export const TOKEN_KEY = "token";
export const USER_ID = "userId";
export const ROLE = "role";
export const ACCESS_ID = "accessId";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const isAdm = () => localStorage.getItem(ROLE) === '1';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUserId = () => localStorage.getItem(USER_ID);
export const getAccessId = () => localStorage.getItem(ACCESS_ID);
export const login = data => {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_ID, data.user.id);
  localStorage.setItem(ROLE, data.user.role);
  
  api.post(`/accesses/register/${getUserId()}`).then(
    res=>localStorage.setItem(ACCESS_ID, res.data)
  );
};
export const logout = () => {
  api.post(`/accesses/finish/${getAccessId()}`).then(res => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ID);
      localStorage.removeItem(ROLE);
      localStorage.removeItem(ACCESS_ID);
    }
  );
};


