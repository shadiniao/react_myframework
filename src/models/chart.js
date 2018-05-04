import { fakeChartData, getRealData } from '../services/api';

export default {
  namespace: 'chart',

  state: {
    visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    loading: false,
    realdata: null,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
    *getRealData(_, { call, put }) {
      const response = yield call(getRealData);
      if (response) {
        yield put({
          type: 'addChartData',
          payload: response,
        });
      }
    },
    *queryRealData({ span }, { call, put }) {
      const response = yield call(getRealData, span);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            realdata: response,
          },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    addChartData(state, { payload }) {
      const { realdata } = state;
      let newRealData = null;

      if (realdata) {
        if (realdata.length >= 60) {
          newRealData = [...realdata.splice(-59), payload];
        } else {
          newRealData = [...realdata, payload];
        }
      } else {
        newRealData = [payload];
      }
      return {
        ...state,
        realdata: newRealData,
      };
    },
    clearChartData(state) {
      return {
        ...state,
        realdata: [],
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
