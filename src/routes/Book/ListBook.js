import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Button, Divider, Table, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// import styles from './TableList.less';

@connect(({ book, loading }) => ({ book, loading: loading.models.book }))
@Form.create()
export default class ListBook extends Component {
  toAdd() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/book/add-book`));
  }

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
        render: val => `${val} 万`,
        // mark to display a total number
        needTotal: true,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <Button type="primary" ghost onClick={this.toEdit.bind(this, record)} icon="edit" />
            <Divider type="vertical" />
            <Button type="primary" ghost onClick={this.remove.bind(this, record)} icon="delete" />
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="图书管理">
        <Card bordered={false}>
          <div>
            <Button
              icon="plus"
              type="primary"
              style={{ marginBottom: 24 }}
              onClick={this.toAdd.bind(this)}
            >
              新建
            </Button>
          </div>
          <Table rowKey="id" dataSource={list} columns={columns} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
