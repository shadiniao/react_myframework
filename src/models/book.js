import pathToRegexp from 'path-to-regexp';
import { query, add, update, getBook, remove } from '../services/book';

export default {
  namespace: 'book',

  state: {
    list: [],
    editTarget: {},
    isEdit: false,
  },

  reducers: {
    setList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    setEditTarget(state, action) {
      return {
        ...state,
        editTarget: action.payload,
      };
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'setList',
        payload: Array.isArray(response) ? response : [],
      });
    },

    *add({ data }, { call, put }) {
      yield call(add, data);
      yield put({
        type: 'fetch',
        payload: {},
      });
    },

    *update({ data }, { call, put }) {
      yield call(update, data);
      yield put({
        type: 'fetch',
        payload: {},
      });
    },

    *getBook({ id }, { call, put }) {
      const result = yield call(getBook, id);
      yield put({
        type: 'setEditTarget',
        payload: result,
      });
    },

    *remove({ id }, { call, put }) {
      yield call(remove, id);
      yield put({ type: 'fetch' });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname.startsWith('/book/list-book')) {
          dispatch({ type: 'fetch', payload: {} });
        } else if (pathname.startsWith('/book/edit-book') > -1) {
          const match = pathToRegexp('/book/edit-book/:id').exec(pathname);
          if (match) {
            const id = match[1];
            dispatch({ type: 'getBook', id });
          } else {
            dispatch({ type: 'setEditTarget', payload: {} });
          }
        }
      });
    },
  },
};
