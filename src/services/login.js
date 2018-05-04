import request from '../utils/request';
import { getAccessToken } from '../utils/authority';

export function login(params) {
  const formData = new FormData();

  formData.append('client_id', 'gateway');
  formData.append('client_secret', 'gateway');
  formData.append('username', params.userName);
  formData.append('password', params.password);
  formData.append('grant_type', 'password');

  return fetch('http://192.168.50.236/oauth/token', {
    method: 'POST',
    body: formData,
    // mode: "no-cors",
  })
    .then(res => {
      if (res.status >= 400) {
        throw new Error('ssss');
      }
      const json = res.json();
      return json;
    })
    .catch(e => {
      return { access_token: '1234567', error: e.message };
    });
}

export function me() {
  const accessToken = getAccessToken();

  return fetch(`/ykapi/user?access_token=${accessToken}`, {
    method: 'GET',
    // headers: {
    // 	Authorization: `Bearer ${accessToken}`,
    // },
  })
    .then(res => {
      if (res.status >= 400) {
        throw new Error('ssss');
      }
      const json = res.json();
      return json;
    })
    .catch(e => {
      let usertype = 'private';
      if (accessToken === 'admin') {
        usertype = 'system';
      }
      const result = {
        data: {
          name: 'admin',
          userid: '00000001',
          notifyCount: 12,
          usertype,
          permission: ['user', 'admin'],
          companies: [
            {
              pid: '373986846897606656',
              companyCode: 'YN_NBL',
              companyName: '云南拿不老水电站',
              stationId: 46,
              isDefault: true,
            },
            {
              pid: '000000000000000002',
              companyCode: 'YN_NBL2',
              companyName: '云南拿不老水电站2',
              stationId: 47,
              isDefault: false,
            },
          ],
          error: e.message,
        },
      };
      return result;
    });
  // return request('http://192.168.50.236:9595/user', {
  // 	method: 'POST',
  // });
}

export async function permission(token) {
  return request('/ykapi/permission', {
    method: 'POST',
    body: { token },
  });
}
