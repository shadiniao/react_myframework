import { query as queryUsers } from '../services/user';

import { getMe } from '../utils/authority';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {}, // 当前登录用户
    currentCompany: {}, // 当前用户的公司
    currentCompanySimple: {}, // 当前用户公司的简单形式,因为查询时一般需要公司信息,而当前公司的pid等属性要转换为companyId,所以创建了这个对象来保存
    mapCompany: {}, // 公司信息map,key为公司id,value为公司信息
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { put }) {
      // const response = yield call(queryCurrent);
      const response = getMe();
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      const { companies } = action.payload;
      const currentCompany = companies.find(company => company.isDefault);
      const mapCompany = {};

      for (const company of companies) {
        mapCompany[company.pid] = company;
      }
      return {
        ...state,
        currentUser: action.payload,
        currentCompany,
        currentCompanySimple: {
          companyId: currentCompany.pid,
          companyCode: currentCompany.companyCode,
          companyName: currentCompany.companyName,
        },
        mapCompany,
      };
    },
    saveCurrentCompany(state, action) {
      const currentCompany = action.payload;
      return {
        ...state,
        currentCompany,
        currentCompanySimple: {
          companyId: currentCompany.pid,
          companyCode: currentCompany.companyCode,
          companyName: currentCompany.companyName,
        },
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
