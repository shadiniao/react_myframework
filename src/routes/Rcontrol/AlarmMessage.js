import React, { Component } from 'react';
import { connect } from 'dva';
import { Radio, Button, Card, Table, Row, Col, Form, DatePicker, Icon, Badge } from 'antd';
import * as moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const levelMap = {
  low: 'success',
  info: 'warning',
  high: 'error',
};

const columns = [
  {
    title: '电站名称',
    dataIndex: 'companyName',
    key: 'companyName',
    width: 70,
    align: 'center',
  },
  {
    title: '级别',
    dataIndex: 'levelDesc',
    key: 'levelDesc',
    width: 70,
    align: 'center',
    render(val, record) {
      return <Badge status={levelMap[record.level]} text={val} />;
    },
  },
  {
    title: '数值',
    dataIndex: 'value',
    key: 'value',
    width: 70,
    align: 'center',
  },
  {
    title: '告警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
    width: 70,
    align: 'center',
    render(val) {
      return moment.unix(val).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '复归时间',
    dataIndex: 'resetTime',
    key: 'resetTime',
    width: 70,
    align: 'center',
    render(val) {
      return val === '0' ? (
        <span>
          <Icon type="close-circle" style={{ color: 'red' }} />未复归
        </span>
      ) : (
        <span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      );
    },
  },
  // {
  // 	title: '是否确认',
  // 	dataIndex: 'confirmedTime',
  // 	key: 'confirmedTime',
  // 	width: 70,
  // 	align: 'center',
  // 	render(val) {
  // 		return val === '0' ? (
  // 			<span>
  // 				<Icon type="close-circle" style={{ color: 'red' }} />未确认
  // 			</span>
  // 		) : (
  // 			<span>
  // 				<Icon type="check-circle" style={{ color: 'green' }} />已确认
  // 			</span>
  // 		);
  // 	},
  // },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    width: 200,
    align: 'center',
  },
  // {
  // 	title: '操作',
  // 	align: 'center',
  // 	width: 100,
  // 	render: (text, record) => (
  // 		<Fragment>
  // 			<Popconfirm title="是否确认该条数据?" onConfirm={() => this.handleDel(record.pid)}>
  // 				<Tooltip placement="bottom" title="对数据进行确认操作">
  // 					<Button type="primary" ghost icon="check" />
  // 				</Tooltip>
  // 			</Popconfirm>
  // 		</Fragment>
  // 	),
  // },
];

@connect(({ alarmMessage, user, loading }) => ({
  alarm_message: alarmMessage,
  companyinfo: user.currentCompanySimple,
  loading: loading.effects['alarmMessage/query'],
}))
@Form.create()
export default class Realtime extends Component {
  componentDidMount() {
    const { dispatch, companyinfo } = this.props;
    dispatch({
      type: 'alarmMessage/query',
      payload: { filter: { companyCode: companyinfo.companyCode } },
    });

    dispatch({ type: 'alarmMessage/subscribCompanyChange' });
  }

  handlePageChange = pagination => {
    const { dispatch, companyinfo, form } = this.props;
    const level = form.getFieldValue('level');
    const dateRange = form.getFieldValue('date');
    let startDate = null;
    let endDate = null;
    if (dateRange && dateRange.length > 0) {
      startDate = dateRange[0].unix();
      endDate = dateRange[1].unix();
    }

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      filter: { companyCode: companyinfo.companyCode, level, startDate, endDate },
    };

    dispatch({ type: 'alarmMessage/query', payload: params });
  };

  query = e => {
    e.preventDefault();
    this.handlePageChange({});
  };

  render() {
    const { alarm_message: { list }, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div {...this.props} style={{ height: '100%' }}>
        <Card>
          <Form layout="inline">
            <Row gutter={{ md: 24 }} style={{ marginBottom: 20 }}>
              <Col sm={24}>
                <FormItem label="级别">
                  {getFieldDecorator('level', {
                    initialValue: '',
                  })(
                    <Radio.Group>
                      <Radio.Button value="">所有级别</Radio.Button>
                      <Radio.Button value="low">低</Radio.Button>
                      <Radio.Button value="info">一般</Radio.Button>
                      <Radio.Button value="high">严重</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>

                <FormItem label="告警起止时间">
                  {getFieldDecorator('date')(
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      // style={{ width: '100%' }}
                      placeholder={['开始时间', '结束时间']}
                    />
                  )}
                </FormItem>

                <FormItem>
                  <Button
                    type="primary"
                    style={{ whiteSpace: 'nowrap', marginBottom: '24px' }}
                    onClick={this.query}
                  >
                    查询
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

          <Row gutter={24} type="flex" justify="start">
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={list.list}
                loading={loading}
                pagination={list.pagination}
                onChange={this.handlePageChange}
                rowKey="pid"
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
