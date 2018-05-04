import * as service from '../../services/rcontrol/acc';

const namespace = 'acc';
const pathname = '/rcontrol/auto-control-config';

export default {
  namespace,

  state: {
    list: {
      list: [], // 查询数据
      pagination: {}, // 分页信息
    },
    filter: {}, // 查询条件
    editTarget: {}, // 要编辑的对象
  },

  reducers: {
    setList(state, action) {
      return {
        ...state,
        list: action.list,
        filter: action.filter,
      };
    },
    setEditTarget(state, action) {
      return {
        ...state,
        editTarget: action.payload,
      };
    },
    setState(state, action) {
      return {
        ...state,
        ...action,
      };
    },
  },

  effects: {
    // 监听切换公司的action,一旦进行切换操作,以新切换的公司重新进行查询
    subscribCompanyChange: [
      function* subscribCompanyChange(action, { put, select, take }) {
        while (true) {
          yield take('user/saveCurrentCompany');
          const currentPathname = yield select(state => state.routing.location.pathname);
          if (currentPathname === pathname) {
            const currentCompanySimple = yield select(state => state.user.currentCompanySimple);
            const pagination = yield select(state => {
              return state[namespace].list.pagination;
            });
            const filter = yield select(state => {
              return state[namespace].filter;
            });
            yield put({
              type: 'query',
              payload: {
                ...pagination,
                page: pagination.current,
                limit: pagination.pageSize,
                filter: {
                  ...filter,
                  companyCode: currentCompanySimple.companyCode,
                },
              },
            });
          }
        }
      },
      { type: 'takeLatest' },
    ],

    // 查询
    *query({ payload = {} }, { call, put }) {
      const response = yield call(service.queryACC, payload);
      if (response && response.code === 200 && response.body) {
        const list = response.body;
        yield put({
          type: 'setList',
          list: {
            list: list.records,
            pagination: {
              total: list.total,
              pageSize: list.limit,
              current: list.pageNo,
            },
          },
          filter: payload.filter,
        });
      }
    },

    // 新增
    *add({ data, callback }, { call, put, select }) {
      const response = yield call(service.addACC, data);
      if (response && response.code === 200) {
        if (callback) callback();

        const filter = yield select(state => {
          return state.acc.filter;
        });
        yield put({
          type: 'query',
          payload: { filter },
        });
      }
    },

    // 修改
    *upt({ data, callback }, { call, put, select }) {
      const response = yield call(service.uptACC, data);
      if (response && response.code === 200) {
        if (callback) callback();
        const pagination = yield select(state => {
          return state.acc.list.pagination;
        });
        const filter = yield select(state => {
          return state.acc.filter;
        });
        yield put({
          type: 'query',
          payload: {
            ...pagination,
            page: pagination.current,
            limit: pagination.pageSize,
            filter,
          },
        });
      }
    },

    // 查询单条数据
    *get({ pid }, { call, put }) {
      const response = yield call(service.getACC, pid);
      if (response && response.code === 200 && response.body) {
        yield put({
          type: 'setEditTarget',
          payload: response.body,
        });
      }
    },

    // 删除
    *del({ pid, callback }, { call, put, select }) {
      const response = yield call(service.delACC, pid);
      if (response && response.code === 200) {
        if (callback) callback();
        const pagination = yield select(state => {
          return state.acc.list.pagination;
        });
        const filter = yield select(state => {
          return state.acc.filter;
        });
        yield put({
          type: 'query',
          payload: {
            ...pagination,
            page: pagination.current,
            limit: pagination.pageSize,
            filter,
          },
        });
      }
    },
  },
};
