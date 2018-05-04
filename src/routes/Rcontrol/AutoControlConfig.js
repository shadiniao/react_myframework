import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Table, Popconfirm, message, Divider } from 'antd';
import styles from './AutoControlConfig.less';
import AutoControlConfigModal, { mapIndex } from './component/AutoControlConfigModal';

@connect(({ acc, loading, user }) => ({
  acc,
  loading:
    loading.effects['acc/query'] ||
    loading.effects['acc/get'] ||
    loading.effects['acc/add'] ||
    loading.effects['acc/upt'] ||
    loading.effects['acc/del'],
  companyinfo: user.currentCompanySimple,
}))
export default class AutoControlConfig extends Component {
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch, companyinfo } = this.props;
    dispatch({
      type: 'acc/query',
      payload: { filter: { companyCode: companyinfo.companyCode } },
    });
    dispatch({ type: 'acc/subscribCompanyChange' });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handlePageChange = pagination => {
    const { dispatch, companyinfo } = this.props;
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      filter: { companyCode: companyinfo.companyCode },
    };

    dispatch({
      type: 'acc/query',
      payload: params,
    });
  };

  toEdit = values => {
    const { pid } = values;
    const { dispatch, companyinfo } = this.props;
    if (pid) {
      dispatch({ type: 'acc/get', pid });
    } else {
      dispatch({ type: 'acc/setEditTarget', payload: companyinfo });
    }

    this.handleModalVisible(true);
  };

  handleOk = form => {
    const { dispatch, companyinfo, acc: { editTarget } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { pid } = editTarget;
        let type = 'acc/add';
        if (pid) {
          type = 'acc/upt';
        }
        dispatch({
          type,
          data: { pid, ...values, ...companyinfo },
          callback: () => {
            this.handleModalVisible();
            form.resetFields();
          },
        });
      }
    });
  };

  handleDel = pid => {
    const { dispatch } = this.props;
    dispatch({
      type: 'acc/del',
      pid,
      callback: () => {
        message.success('删除成功');
      },
    });
  };

  render() {
    const { modalVisible } = this.state;
    const { acc: { list, editTarget }, loading } = this.props;

    const columns = [
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '机组',
        dataIndex: 'machineId',
        key: 'machineId',
        align: 'center',
      },
      {
        title: '名称',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        render(val) {
          return mapIndex[val - 1];
        },
      },
      {
        title: '死区',
        dataIndex: 'deadband',
        key: 'deadband',
        align: 'center',
      },
      {
        title: '数据值',
        dataIndex: 'value',
        key: 'value',
        align: 'center',
      },
      {
        title: '是否检查',
        dataIndex: 'isCheck',
        key: 'isCheck',
        align: 'center',
        render(val) {
          return val ? '是' : '否';
        },
      },
      {
        title: '无变化失效',
        dataIndex: 'noChangeNum',
        key: 'noChangeNum',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <Fragment>
            <Button
              type="primary"
              ghost
              icon="edit"
              onClick={() => this.toEdit({ pid: record.pid })}
            />
            <Divider type="vertical" />
            <Popconfirm title="确定要删除该条数据吗?" onConfirm={() => this.handleDel(record.pid)}>
              <Button type="primary" ghost icon="delete" />
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <Card>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.toEdit({})}>
              新建
            </Button>
          </div>
          <Table
            rowKey="pid"
            columns={columns}
            dataSource={list.list}
            loading={loading}
            pagination={list.pagination}
            onChange={this.handlePageChange}
          />
        </Card>

        <AutoControlConfigModal
          spinning={loading}
          data={editTarget}
          onSubmit={this.onSubmit}
          title="编辑"
          visible={modalVisible}
          onCancel={() => this.handleModalVisible()}
          onOk={this.handleOk}
          confirmLoading={loading}
        />
      </div>
    );
  }
}
