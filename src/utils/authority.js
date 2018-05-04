// use localStorage to store the authority info, which might be sent from server in actual project.
const ACCESS_TOKEN = 'access_token';

const ME = 'me';

export function getAuthority() {
  // return JSON.parse(localStorage.getItem('my-permission') || '[]');
  return JSON.parse(sessionStorage.getItem('my-permission') || '[]');
}

export function setAuthority(authority) {
  // localStorage.setItem('my-permission', JSON.stringify(authority));
  if (authority) {
    sessionStorage.setItem('my-permission', JSON.stringify(authority));
  }
}

/**
 * 设置登录信息到localStorage
 * @param {access_token, token_type, refresh_token, expires_in, scope} loginInfo
 */
export function setLoginInfo(loginInfo = {}) {
  setAccessToken(loginInfo.access_token);
}

/**
 * 从localStorage中获取access_token
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN);
}

/**
 * 设置token到localStorage中
 * @param string token
 */
export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN, token);
  }
}

export function getMe() {
  return JSON.parse(localStorage.getItem(ME) || '{}');
}

/**
 * 设置当前用户信息到localStorage中
 * @param {*} me 当前用户信息
 */
export function setMe(me) {
  if (me) {
    localStorage.setItem(ME, JSON.stringify(me));
    setAuthority(me.permission);
  }
}
