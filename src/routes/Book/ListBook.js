import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Button, Divider, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// import styles from './TableList.less';

@connect(({ book, loading }) => ({ book, loading: loading.models.mylist }))
@Form.create()
export default class ListBook extends PureComponent {
	toEdit(book) {
		const { dispatch } = this.props;
		dispatch(routerRedux.push(`/book/edit-book/${book.id}`));
	}

	remove(book) {
		const { dispatch } = this.props;
		dispatch({ type: 'book/remove', id: book.id });
	}

	render() {
		const { book: { list = {} } = {} } = this.props;
		const columns = [
			{
				title: 'id',
				dataIndex: 'id',
			},
			{
				title: 'name',
				dataIndex: 'name',
			},
			{
				title: 'price',
				dataIndex: 'price',
				sorter: true,
				align: 'right',
				render: (val) => `${val} 万`,
				// mark to display a total number
				needTotal: true,
			},
			{
				title: '操作',
				render: (text, record) => (
					<Fragment>
						<Button type="primary" ghost onClick={this.toEdit.bind(this, record)}>
							配置
						</Button>
						<Divider type="vertical" />
						<Button type="primary" ghost onClick={this.remove.bind(this, record)}>
							删除
						</Button>
					</Fragment>
				),
			},
		];
		return (
			<PageHeaderLayout title="图书管理">
				<Table rowKey="id" dataSource={list} columns={columns} />
			</PageHeaderLayout>
		);
	}
}
