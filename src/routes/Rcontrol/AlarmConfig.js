import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Table, Popconfirm, message, Divider } from 'antd';
import styles from './AutoControlConfig.less';
import AlarmConfigModal from './component/AlarmConfigModal';

@connect(({ alarmConfig, loading, user }) => ({
  alarm_config: alarmConfig,
  loading:
    loading.effects['alarmConfig/query'] ||
    loading.effects['alarmConfig/get'] ||
    loading.effects['alarmConfig/add'] ||
    loading.effects['alarmConfig/upt'] ||
    loading.effects['alarmConfig/del'],
  companyinfo: user.currentCompanySimple,
}))
export default class AutoControlConfig extends Component {
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch, companyinfo } = this.props;
    dispatch({
      type: 'alarmConfig/query',
      payload: { filter: { companyCode: companyinfo.companyCode } },
    });
    dispatch({ type: 'alarmConfig/subscribCompanyChange' });
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
      type: 'alarmConfig/query',
      payload: params,
    });
  };

  toEdit = values => {
    const { pid } = values;
    const { dispatch, companyinfo } = this.props;
    if (pid) {
      dispatch({ type: 'alarmConfig/get', pid });
    } else {
      dispatch({ type: 'alarmConfig/setEditTarget', payload: companyinfo });
    }

    this.handleModalVisible(true);
  };

  handleOk = form => {
    const { dispatch, companyinfo, alarm_config: { editTarget } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { pid } = editTarget;
        let type = 'alarmConfig/add';
        if (pid) {
          type = 'alarmConfig/upt';
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
      type: 'alarmConfig/del',
      pid,
      callback: () => {
        message.success('删除成功');
      },
    });
  };

  render() {
    const { modalVisible } = this.state;
    const { alarm_config: { list, editTarget }, loading } = this.props;

    const columns = [
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '名称',
        dataIndex: 'alarmName',
        key: 'alarmName',
        align: 'center',
      },
      {
        title: '描述',
        dataIndex: 'alarmDesc',
        key: 'alarmDesc',
        align: 'center',
      },
      {
        title: '接收端',
        dataIndex: 'alarmWay',
        key: 'alarmWay',
        align: 'center',
      },

      {
        title: '状态',
        dataIndex: 'configState',
        key: 'configState',
        align: 'center',
      },
      {
        title: '确认',
        dataIndex: 'isConfirm',
        key: 'isConfirm',
        align: 'center',
        render(val) {
          return val ? '是' : '否';
        },
      },
      {
        title: '语音告警',
        dataIndex: 'isVoice',
        key: 'isVoice',
        align: 'center',
        render(val) {
          return val ? '是' : '否';
        },
      },
      {
        title: '语音文件',
        dataIndex: 'voiceFile',
        key: 'voiceFile',
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

        <AlarmConfigModal
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
