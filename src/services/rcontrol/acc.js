import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryACC(params) {
  return request(`http://192.168.50.120:8000/remote/configs?${stringify(params)}`);
}

export async function addACC(data) {
  return request(`http://192.168.50.120:8000/remote/config`, { method: 'POST', body: data });
}

export async function uptACC(data) {
  return request(`http://192.168.50.120:8000/remote/config/${data.pid}`, {
    method: 'PUT',
    body: data,
  });
}

export async function delACC(pid) {
  return request(`http://192.168.50.120:8000/remote/config/${pid}`, { method: 'DELETE' });
}

export async function getACC(pid) {
  return request(`http://192.168.50.120:8000/remote/config/${pid}`);
}
