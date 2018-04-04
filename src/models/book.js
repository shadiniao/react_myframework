import { query, update, getBook, remove } from '../services/book';

export default {
	namespace: 'book',

	state: {
		list: [],
		editTarget: null,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				switch (location.pathname) {
					case '/book/list-book':
						dispatch({
							type: 'book/fetch',
							payload: {},
						});
						break;
					default:
						break;
				}
			});
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

		*update({ data }, { call, put }) {
			const response = yield call(update, data);
			console.log(response);
			// yield put({
			// 	type: 'queryList',
			// 	payload: Array.isArray(response) ? response : [],
			// });
		},

		*getBook({ id }, { call, put }) {
			const response = yield call(getBook, id);
			yield put({
				type: 'setEditTarget',
				payload: response,
			});
		},

		*remove({ id }, { call, put }) {
			yield call(remove, id);
			yield put({ type: 'fetch' });
		},
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
};
