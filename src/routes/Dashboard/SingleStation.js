import React, { Component, Fragment } from 'react';
import { Row, Col, Icon, Card, Radio, Tooltip } from 'antd';
import { Chart, Legend, Axis, Tooltip as CTooltip, Geom } from 'bizcharts';
import { ChartCard, Field, GaugeNumber } from 'components/Charts';
import * as moment from 'moment';

// @connect(({ chart, loading }) => ({
// 	chart,
// 	loading: loading.effects['chart/fetch'],
// }))

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

function generatorWater() {
  const arr = [];
  const now = moment();
  const start = moment()
    .startOf('month')
    .subtract(1, 'days');
  const span = now.diff(start, 'days');

  for (let index = 0; index < span; index += 1) {
    const date = start.add(1, 'days');
    const total = Math.round(Math.random() * 2500);
    const consume = Math.round(Math.random() * 50);
    arr.push({ date: date.format('MM-DD'), total, consume });
    // arr.push({ date: date.format('MM-DD'), consume });
  }

  return arr;
}

export default class Analysis extends Component {
  state = {
    queryType: 'week',
  };

  handleChangeQueryType = e => {
    this.setState({
      queryType: e.target.value,
    });
  };

  render() {
    const { queryType } = this.state;

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 8,
      style: { marginBottom: 24 },
    };

    const scaleTrend = {
      trend: {
        min: 0,
        alias: '发电量',
      },
    };

    const scaleWater = {
      total: {
        min: 0,
        alias: '水量',
      },
      consume: {
        min: 0,
        alias: '耗水率',
      },
    };

    const queryTypeExtra = (
      <Radio.Group value={queryType} onChange={this.handleChangeQueryType}>
        <Radio.Button value="week">本周</Radio.Button>
        <Radio.Button value="month">本月</Radio.Button>
        <Radio.Button value="year">本年</Radio.Button>
      </Radio.Group>
    );

    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="当前投入运行容量"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="3810 MW"
              footer={
                <div>
                  <Field label="总装机容量" value="4500 MW" />
                  <Field label="停机容量" value="70 MW" />
                </div>
              }
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="昨日发电量"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="500 kW.h"
              footer={
                <div>
                  <Field label="月累计" value="4500 kW.h" />
                  <Field label="年累计" value="124500 kW.h" />
                </div>
              }
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="昨日上网电量"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="498 kW.h"
              footer={
                <div>
                  <Field label="月累计" value="4500 kW.h" />
                  <Field label="年累计" value="124500 kW.h" />
                </div>
              }
              contentHeight={46}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={6} lg={6}>
            <Card
              title="今日上网电量"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <GaugeNumber title="万kW.h" height={200} percent={80} />
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card
              title="今日发电量"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <GaugeNumber title="万kW.h" height={200} percent={90} />
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card
              title="厂用电量"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <GaugeNumber title="%" height={200} percent={87} />
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card
              title="厂用电率"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <GaugeNumber title="万kW.h" height={200} percent={87} />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card
              title="发电趋势"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
              extra={queryTypeExtra}
            >
              <Chart
                height={200}
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
                  color="trend"
                  style={{ stroke: '#fff', lineWidth: 1 }}
                />
              </Chart>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card
              title="水情信息"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <Chart
                height={200}
                scale={scaleWater}
                forceFit
                data={generatorWater()}
                padding={[20, 80, 80, 80]}
              >
                <Legend
                  custom
                  items={[
                    {
                      name: 'total',
                      value: '日入库总水量',
                      marker: {
                        symbol: 'square',
                        fill: '#3182bd',
                        radius: 5,
                      },
                    },
                    {
                      name: 'consume',
                      value: '日均耗水率',
                      marker: {
                        symbol: 'hyphen',
                        stroke: '#ffae6b',
                        radius: 5,
                        lineWidth: 3,
                      },
                    },
                  ]}
                />
                <Axis
                  name="total"
                  title={{
                    offset: 60,
                  }}
                  grid={null}
                />
                <Axis
                  name="consume"
                  title
                  grid={null}
                  label={{
                    textStyle: {
                      fill: '#fdae6b',
                    },
                  }}
                />
                <CTooltip />
                <Geom type="interval" position="date*total" color="#3182bd" />
                <Geom type="line" position="date*consume" color="#fdae6b" size={3} shape="smooth" />
                <Geom
                  type="point"
                  position="date*consume"
                  color="#fdae6b"
                  size={3}
                  shape="circle"
                />
              </Chart>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
