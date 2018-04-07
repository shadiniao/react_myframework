import request from '../utils/request';

export async function query() {
  return request(`http://localhost:3000/book`);
}

export async function add(data) {
  return request(`http://localhost:3000/book`, {
    method: 'POST',
    body: data,
    header: {
      'Content-Type': 'application/json',
    },
  });
}

export async function update(data) {
  return request(`http://localhost:3000/book/${data.id}`, {
    method: 'PUT',
    body: data,
    header: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getBook(id) {
  return request(`http://localhost:3000/book/${id}`);
}

export async function remove(id) {
  return request(`http://localhost:3000/book/${id}`, { method: 'delete' });
}
