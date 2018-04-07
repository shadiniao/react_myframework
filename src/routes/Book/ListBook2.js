import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Button, Divider, Table, Card, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModalBook from './ModalBook';

// import styles from './TableList.less';

@connect(({ book, loading }) => ({ book, loading: loading.models.book }))
@Form.create()
export default class ListBook extends Component {
  edit(values) {
    const { id } = values;
    const { dispatch } = this.props;
    let type = 'book/add';
    if (id) {
      type = 'book/update';
    }
    dispatch({ type, data: values });
  }

  remove(book) {
    const { dispatch } = this.props;
    dispatch({ type: 'book/remove', id: book.id });
  }

  render() {
    const { loading, book: { list = {} } = {} } = this.props;
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
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <ModalBook onOk={this.edit.bind(this)} dataId={record.id}>
              <Button type="primary" ghost icon="edit" />
            </ModalBook>
            <Divider type="vertical" />
            <Popconfirm title="确定要删除该条数据吗?" onConfirm={this.remove.bind(this, record)}>
              <Button type="primary" ghost icon="delete" />
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="图书管理">
        <Card bordered={false}>
          <div>
            <ModalBook onOk={this.edit.bind(this)}>
              <Button icon="plus" type="primary" style={{ marginBottom: 24 }}>
                新建
              </Button>
            </ModalBook>
          </div>
          <Table rowKey="id" dataSource={list} columns={columns} loading={loading} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
