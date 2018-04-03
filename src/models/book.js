import {query, update} from '../services/book';

export default {
  namespace : 'book',

  state : {
    list: [],
  },

  effects : {
    *fetch({
      payload,
    }, {call, put}) {
      const response = yield call(query, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response)
          ? response
          : [],
      });
    },

    *update({
      id,
    }, {call, put}) {
      const response = yield call(update, id);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response)
          ? response
          : [],
      });
    },
  },

  reducers : {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
