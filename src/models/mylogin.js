import { routerRedux } from 'dva/router';
import * as serviceLogin from '../services/login';
import { setLoginInfo, setMe } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'mylogin',

  state: {
    msg: undefined,
    error: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const loginInfo = yield call(serviceLogin.login, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: { loginInfo },
      });

      if (!loginInfo || loginInfo.error) {
        return;
      }

      const respMe = yield call(serviceLogin.me);

      if (!respMe || respMe.error) {
        yield put({
          type: 'setError',
          payload: { respMe },
        });
        return;
      }

      setMe(respMe.data);

      // Login successfully
      reloadAuthorized();
      yield put(routerRedux.push('/'));
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/mylogin'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload = {} }) {
      const { loginInfo } = payload;
      setLoginInfo(loginInfo);
      return {
        ...state,
        msg: loginInfo.message,
        error: loginInfo.error,
      };
    },

    setError(state, { payload = {} }) {
      return {
        ...state,
        msg: payload.message,
        error: payload.error,
      };
    },
  },
};
