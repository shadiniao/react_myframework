import React, { Component } from 'react';
import { connect } from 'dva';
import { Radio, Button, Card, Table, Row, Col, Form, DatePicker } from 'antd';
import * as moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: '电站名称',
    dataIndex: 'companyName',
    key: 'companyName',
    width: 70,
    align: 'center',
  },
  {
    title: '事件类型',
    dataIndex: 'eventTypeDesc',
    key: 'eventTypeDesc',
    width: 70,
    align: 'center',
  },
  {
    title: '发生时间',
    dataIndex: 'eventTime',
    key: 'eventTime',
    width: 70,
    align: 'center',
    render(val) {
      return moment.unix(val).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    width: 200,
    align: 'center',
  },
];

@connect(({ alarmEvent, user, loading }) => ({
  alarm_event: alarmEvent,
  companyinfo: user.currentCompanySimple,
  loading: loading.effects['alarmEvent/query'],
}))
@Form.create()
export default class Realtime extends Component {
  componentDidMount() {
    const { dispatch, companyinfo } = this.props;
    dispatch({
      type: 'alarmEvent/query',
      payload: { filter: { companyCode: companyinfo.companyCode } },
    });

    dispatch({ type: 'alarmEvent/subscribCompanyChange' });
  }

  handlePageChange = pagination => {
    const { dispatch, companyinfo, form } = this.props;
    const eventType = form.getFieldValue('eventType');
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
      filter: { companyCode: companyinfo.companyCode, eventType, startDate, endDate },
    };

    dispatch({ type: 'alarmEvent/query', payload: params });
  };

  query = e => {
    e.preventDefault();
    this.handlePageChange({});
  };

  render() {
    const { alarm_event: { list }, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div {...this.props} style={{ height: '100%' }}>
        <Card>
          <Form layout="inline">
            <Row gutter={{ md: 24 }} style={{ marginBottom: 20 }}>
              <Col sm={24}>
                <FormItem label="类型">
                  {getFieldDecorator('eventType', {
                    initialValue: '',
                  })(
                    <Radio.Group>
                      <Radio.Button value="">所有类型</Radio.Button>
                      <Radio.Button value="sysadjust">系统调节</Radio.Button>
                      <Radio.Button value="sysstatus">系统状态</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>

                <FormItem label="查询起止日期">
                  {getFieldDecorator('date')(
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      // style={{ width: '100%' }}
                      placeholder={['开始日期', '结束日期']}
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
