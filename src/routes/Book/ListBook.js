import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider,
    Table,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import {routerRedux} from 'dva/router';

// import styles from './TableList.less';

@connect(({book, loading}) => ({book, loading: loading.models.mylist}))
@Form.create()
export default class BookList extends PureComponent {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({type: 'book/fetch'});
    }

    toEdit() {
        const {dispatch} = this.props;
        dispatch(routerRedux.push('/book/edit-book'));
    }

    render() {
        const {book: {
                list,
            }} = this.props;
        const columns = [
            {
                title: 'id',
                dataIndex: 'id',
            }, {
                title: 'name',
                dataIndex: 'name',
            }, {
                title: 'price',
                dataIndex: 'price',
                sorter: true,
                align: 'right',
                render: val => `${val} 万`,
                // mark to display a total number
                needTotal: true,
            }, {
                title: '操作',
                render: () => (
                  <Fragment>
                    <Button type="primary" ghost onClick={this.toEdit.bind(this)}>配置</Button>
                    <Divider type="vertical" />
                    <Button type="primary" ghost onClick={this.toEdit.bind(this)}>删除</Button>
                  </Fragment>
                ),
            },
        ];
        return (
          <PageHeaderLayout title="图书管理">
            <Table rowKey='id' dataSource={list} columns={columns} />
          </PageHeaderLayout>
        )
    }
}