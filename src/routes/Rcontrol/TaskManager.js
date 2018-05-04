import React, { Component } from 'react';
import { Radio, Card, Row, Col, DatePicker } from 'antd';
import { Chart, Legend, Axis, Tooltip as CTooltip, Geom } from 'bizcharts';
import * as moment from 'moment';

const { RangePicker } = DatePicker;

function generateData() {
  const arr = [];
  const start = moment()
    .startOf('week')
    .subtract(1, 'days');
  for (let index = 0; index < 7; index += 1) {
    const date = start.add(1, 'days');
    const trend = Math.round(Math.random() * 100);
    arr.push({ date: date.format('MM-DD'), trend });
  }

  return arr;
}

const scaleTrend = {
  trend: {
    min: 0,
    alias: '发电量',
  },
};

const dataDisk = [
  { type: 'total', time: '13:45', value: 30 },
  { type: 'total', time: '13:46', value: 30 },
  { type: 'total', time: '13:47', value: 30 },
  { type: 'total', time: '13:48', value: 30 },
  { type: 'total', time: '13:49', value: 30 },
  { type: 'total', time: '13:50', value: 30 },
  { type: 'total', time: '13:51', value: 30 },
  { type: 'used', time: '13:45', value: 10 },
  { type: 'used', time: '13:46', value: 10 },
  { type: 'used', time: '13:47', value: 10 },
  { type: 'used', time: '13:48', value: 10 },
  { type: 'used', time: '13:49', value: 13 },
  { type: 'used', time: '13:50', value: 13 },
  { type: 'used', time: '13:51', value: 23 },
];

const mapDiskType = {
  total: '磁盘总量',
  used: '已用磁盘',
};

const scaleDisk = {
  time: {
    alias: '时间',
    range: [0, 1],
  },
  value: {
    alias: '磁盘空间',
    min: 0,
  },
};

export default class Realtime extends Component {
  render() {
    return (
      <div {...this.props} style={{ height: '100%' }}>
        <Row gutter={24} style={{ marginBottom: 20 }}>
          <Col>
            <Radio.Group value="large" style={{ marginRight: 20 }}>
              <Radio.Button value="1h">1小时</Radio.Button>
              <Radio.Button value="6h">6小时</Radio.Button>
              <Radio.Button value="12h">12小时</Radio.Button>
              <Radio.Button value="1d">1天</Radio.Button>
              <Radio.Button value="3d">3天</Radio.Button>
              <Radio.Button value="7d">7天</Radio.Button>
              <Radio.Button value="14d">14天</Radio.Button>
            </Radio.Group>

            <span style={{ marginRight: 10 }}>选择时间范围:</span>
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              // style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Card
              title="CPU使用率"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered
            >
              <Chart
                height={250}
                data={generateData()}
                scale={scaleTrend}
                padding={[20, 80, 40, 80]}
                forceFit
              >
                <Legend />
                <Axis name="date" alias="日期" />
                <Axis name="trend" alias="发电量" label={{ formatter: val => `${val} 万kW.h` }} />
                <CTooltip crosshairs={{ type: 'y' }} />
                <Geom type="line" position="date*trend" size={2} color="trend" />
                <Geom type="point" position="date*trend" size={4} shape="circle" />
              </Chart>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="内存使用记录"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered
            >
              <Chart
                height={250}
                data={generateData()}
                scale={scaleTrend}
                padding={[20, 80, 40, 80]}
                forceFit
              >
                <Legend />
                <Axis name="date" alias="日期" />
                <Axis name="trend" alias="发电量" label={{ formatter: val => `${val} 万kW.h` }} />
                <CTooltip crosshairs={{ type: 'y' }} />
                <Geom type="line" position="date*trend" size={2} color="trend" />
                <Geom type="point" position="date*trend" size={4} shape="circle" />
              </Chart>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="磁盘占有率"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered
            >
              <Chart height={250} data={dataDisk} scale={scaleDisk} forceFit>
                <Axis name="time" />
                <Axis name="value" />
                <Legend itemFormatter={value => mapDiskType[value]} />
                <CTooltip crosshairs={{ type: 'line' }} />
                <Geom type="area" position="time*value" color="type" />
                <Geom type="line" position="time*value" size={2} color="type" />
              </Chart>
            </Card>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Card
              title="进程CPU使用率"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered
            >
              <Chart
                height={250}
                data={generateData()}
                scale={scaleTrend}
                padding={[20, 80, 40, 80]}
                forceFit
              >
                <Legend />
                <Axis name="date" alias="日期" />
                <Axis name="trend" alias="发电量" label={{ formatter: val => `${val} 万kW.h` }} />
                <CTooltip crosshairs={{ type: 'y' }} />
                <Geom type="line" position="date*trend" size={2} color="trend" />
                <Geom type="point" position="date*trend" size={4} shape="circle" />
              </Chart>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="进程内存使用记录"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered
            >
              <Chart
                height={250}
                data={generateData()}
                scale={scaleTrend}
                padding={[20, 80, 40, 80]}
                forceFit
              >
                <Legend />
                <Axis name="date" alias="日期" />
                <Axis name="trend" alias="发电量" label={{ formatter: val => `${val} 万kW.h` }} />
                <CTooltip crosshairs={{ type: 'y' }} />
                <Geom type="line" position="date*trend" size={2} color="trend" />
                <Geom
                  type="point"
                  position="date*trend"
                  size={4}
                  shape="circle"
                  color="year"
                  style={{ stroke: '#fff', lineWidth: 1 }}
                />
              </Chart>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
