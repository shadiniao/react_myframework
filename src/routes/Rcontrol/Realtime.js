import React, { Component } from 'react';
import { Radio, Button, Icon, Card, Table, Row, Col, Badge } from 'antd';

const statusMap = {
  是: 'success',
  否: 'error',
};

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 70,
    align: 'center',
  },
  {
    title: '级别',
    dataIndex: 'level',
    key: 'level',
    width: 70,
    align: 'center',
  },
  {
    title: '确认',
    dataIndex: 'confirm',
    key: 'confirm',
    width: 70,
    align: 'center',
    render(val) {
      return <Badge status={statusMap[val]} text={val} />;
    },
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    align: 'center',
  },
  {
    title: '发生时间',
    dataIndex: 'happenTime',
    key: 'happenTime',
    width: 170,
    align: 'center',
  },
  {
    title: '恢复时间',
    dataIndex: 'recoverTime',
    key: 'recoverTime',
    width: 170,
    align: 'center',
  },
  {
    title: '电站',
    dataIndex: 'station',
    key: 'station',
    width: 150,
    align: 'center',
  },
  {
    title: '间隔',
    dataIndex: 'span',
    key: 'span',
    width: 200,
    align: 'center',
  },
  {
    title: '设备',
    dataIndex: 'equip',
    key: 'equip',
    width: 170,
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    align: 'center',
  },
  {
    title: '修复建议',
    dataIndex: 'suggest',
    key: 'suggest',
    width: 120,
    align: 'center',
  },
];

const data = [
  {
    index: '1',
    level: '重要',
    confirm: '是',
    name: '[49#方阵3#逆变器]限功率',
    happenTime: '2018-04-20 15:37:20',
    recoverTime: '11',
    station: 'wfwf',
    span: '#5电源进线柜 49号方阵',
    equip: '49#方阵02#逆变器',
    type: '变位信号',
    suggest: '修复建议',
  },
  {
    index: '2',
    level: '重要',
    confirm: '否',
    name: '[49#方阵3#逆变器]限功率',
    happenTime: '2018-04-20 15:37:20',
    recoverTime: '11',
    station: 'aaaa',
    span: '#5电源进线柜 49号方阵',
    equip: '49#方阵02#逆变器',
    type: '变位信号',
    suggest: '修复建议',
  },
  {
    index: '3',
    level: '重要',
    confirm: '否',
    name: '[49#方阵3#逆变器]限功率',
    happenTime: '2018-04-20 15:37:20',
    recoverTime: '11',
    station: 'eeew',
    span: '#5电源进线柜 49号方阵',
    equip: '49#方阵02#逆变器',
    type: '变位信号',
    suggest: '修复建议',
  },
];

export default class Realtime extends Component {
  state = {
    showAlert: true,
  };

  switchShow() {
    const { showAlert } = this.state;
    this.setState({
      showAlert: !showAlert,
    });
  }

  render() {
    const { showAlert } = this.state;
    return (
      <div {...this.props} style={{ height: '100%' }}>
        <img
          src="http://192.168.1.200/svg/BZZ/ZhuJieXianTu.svg?_v=1495175778000"
          alt=""
          width="95%"
          height="85%"
        />
        <div
          style={{
            position: 'fixed',
            width: '97%',
            bottom: 0,
          }}
        >
          <Button size="large" style={{ float: 'right' }} onClick={this.switchShow.bind(this)}>
            告警
            {showAlert ? <Icon type="caret-down" /> : <Icon type="caret-up" />}
          </Button>
          {showAlert && (
            <Card
              style={{
                clear: 'both',
              }}
            >
              <Row
                gutter={24}
                type="flex"
                justify="start"
                style={{
                  marginBottom: 20,
                }}
              >
                <Col span={10}>
                  <Radio.Group value="large">
                    <Radio.Button value="all">告警总揽</Radio.Button>
                    <Radio.Button value="exception">异常告警</Radio.Button>
                    <Radio.Button value="signal">变位信号</Radio.Button>
                    <Radio.Button value="notice">告知信息</Radio.Button>
                    <Radio.Button value="range">越限警示</Radio.Button>
                    <Radio.Button value="SOE">SOE</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col span={14} style={{ textAlign: 'right' }}>
                  <Badge status="processing" />
                  <span style={{ verticalAlign: 'middle' }}>总记录</span>
                  <span
                    style={{
                      verticalAlign: 'middle',
                      fontSize: 23,
                      marginLeft: 10,
                      color: 'black',
                      marginRight: 40,
                    }}
                  >
                    5
                  </span>
                  <Badge status="success" />
                  <span style={{ verticalAlign: 'middle' }}>已确认</span>
                  <span
                    style={{
                      verticalAlign: 'middle',
                      fontSize: 23,
                      marginLeft: 10,
                      color: 'black',
                      marginRight: 40,
                    }}
                  >
                    3
                  </span>
                  <Badge status="error" />
                  <span style={{ verticalAlign: 'middle' }}>未确认</span>
                  <span
                    style={{
                      verticalAlign: 'middle',
                      fontSize: 23,
                      marginLeft: 10,
                      color: 'black',
                    }}
                  >
                    2
                  </span>
                </Col>
              </Row>
              <Row gutter={24} type="flex" justify="start">
                <Col span={24}>
                  <Table
                    dataSource={data}
                    pagination={false}
                    columns={columns}
                    bordered
                    scroll={{ y: 350 }}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </div>
      </div>
    );
  }
}
