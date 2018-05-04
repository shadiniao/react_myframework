import { stringify } from 'qs';
import request from '../../utils/request';

export async function query(params) {
  return request(
    `http://192.168.50.120/alarm/configs?${stringify(params, { encodeValuesOnly: true })}`
  );
}

export async function add(data) {
  return request(`http://192.168.50.120/alarm/config`, { method: 'POST', body: data });
}

export async function upt(data) {
  return request(`http://192.168.50.120/alarm/config/${data.pid}`, {
    method: 'PUT',
    body: data,
  });
}

export async function del(pid) {
  return request(`http://192.168.50.120/alarm/config/${pid}`, { method: 'DELETE' });
}

export async function get(pid) {
  return request(`http://192.168.50.120/alarm/config/${pid}`);
}
