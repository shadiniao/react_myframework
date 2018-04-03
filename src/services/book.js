import request from '../utils/request';

export async function query(params) {
    return request(`http://localhost:3000/book`);
}

export async function update(id) {
    return request(`http://localhost:3000/book/${id}`, {method: 'post'});
}