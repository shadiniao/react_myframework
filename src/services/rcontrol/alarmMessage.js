import { stringify } from 'qs';
import request from '../../utils/request';

export async function query(params) {
  return request(
    `http://192.168.50.120/alarm/messages?${stringify(params, { encodeValuesOnly: true })}`
  );
}
