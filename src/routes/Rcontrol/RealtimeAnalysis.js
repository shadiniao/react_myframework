import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Radio, Row, Col, Form, Select } from 'antd';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
@Form.create()
export default class RealtimeAnalysis extends Component {
  constructor(props) {
    super(props);
    this.timeId = undefined;
  }

  componentWillMount() {
    this.startQuery(60);
  }

  componentWillUnmount() {
    if (this.timeId) {
      clearInterval(this.timeId);
    }
    const { dispatch } = this.props;
    dispatch({ type: 'chart/clearChartData' });
  }

  startQuery(timeSpan) {
    const { dispatch } = this.props;
    dispatch({ type: 'chart/queryRealData', span: timeSpan });
    this.timeId = setInterval(() => {
      dispatch({ type: 'chart/getRealData' });
    }, timeSpan / 60 * 1000);
  }

  changeChartType(e) {
    const { value } = e.target;
    const time = parseInt(value, 0);
    if (this.timeId) {
      clearInterval(this.timeId);
    }

    const { dispatch } = this.props;
    dispatch({ type: 'chart/clearChartData' });

    this.startQuery(time);
  }

  render() {
    const { chart: { realdata } } = this.props;
    const { getFieldDecorator } = this.props.form;

    const timeScale = {
      type: 'time',
      tickCount: 10,
      mask: 'mm:ss',
    };

    const cols = {
      x: timeScale,
      value: {
        max: 100,
        min: 0,
      },
    };

    const extraContent = (
      <RadioGroup defaultValue="60" onChange={this.changeChartType.bind(this)}>
        <RadioButton value="60">一分钟</RadioButton>
        <RadioButton value="300">五分钟</RadioButton>
        <RadioButton value="600">十分钟</RadioButton>
        <RadioButton value="1800">半小时</RadioButton>
        <RadioButton value="3600">小时线</RadioButton>
      </RadioGroup>
    );

    let ds = null;
    let dv = null;
    if (realdata && realdata.length > 0) {
      ds = new DataSet();
      dv = ds.createView();
      dv.source(realdata).transform({
        type: 'fold',
        fields: ['y1', 'y2'], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });
    }

    return (
      <Fragment>
        <Card
          // loading={loading}
          bordered={false}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
          extra={extraContent}
          title="实时曲线"
        >
          <div style={{ padding: '24px 24px' }}>
            <Form layout="inline">
              <Row gutter={{ md: 24 }} style={{ marginBottom: 20 }}>
                <Col sm={24}>
                  <FormItem label="组件1">
                    {getFieldDecorator('unit1', {
                      initialValue: '',
                    })(
                      <Select
                        showSearch
                        allowClear
                        labelInValue
                        placeholder="请选择组件1"
                        // notFoundContent={
                        // 	fetching ? <Spin size="small" /> : null
                        // }
                        filterOption={false}
                        onSearch={this.fetchUser}
                        onChange={this.handleChange}
                        style={{ width: 150 }}
                      >
                        <Option key="111">1号组件</Option>
                        {/* {data.map((d) => (
													<Option key={d.value}>{d.text}</Option>
												))} */}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem label="组件2">
                    {getFieldDecorator('unit2', {
                      initialValue: '',
                    })(
                      <Select
                        showSearch
                        allowClear
                        labelInValue
                        placeholder="请选择组件2"
                        // notFoundContent={
                        // 	fetching ? <Spin size="small" /> : null
                        // }
                        filterOption={false}
                        onSearch={this.fetchUser}
                        onChange={this.handleChange}
                        style={{ width: 150 }}
                      >
                        <Option key="222">2号组件</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>

            {dv ? (
              <Chart padding={[60, 60, 40, 40]} data={dv} scale={cols} height={500} forceFit>
                <Axis name="x" />
                <Tooltip />
                <Legend name="key" position="top" />
                <Geom type="line" position="x*value" size={2} color="key" shape="smooth" />
              </Chart>
            ) : null}
          </div>
        </Card>
      </Fragment>
    );
  }
}
