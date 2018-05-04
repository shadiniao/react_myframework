import React, { Component } from 'react';
import { Form, Select, Switch, InputNumber, Modal, Spin } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

export const mapIndex = [
  '有功功率给定值',
  '有功功率下限值',
  '有功功率上限值',
  '调速器开度上限值',
  '增有功水位设定值',
  '减有功水位设定值',
  '前导瓦高温设定值',
  '后导瓦高温设定值',
  '推力瓦高温设定值',
  '定子高温设定值',
  '功率因数给定值',
  '停机水位设定值',
  '自动停机延时计时（秒）',
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@Form.create()
export default class AutoControlConfigModal extends Component {
  handleOk = e => {
    e.preventDefault();
    const { onOk, form } = this.props;
    if (onOk) {
      onOk(form);
    }
  };

  render() {
    const { data = {}, spinning } = this.props;
    const { getFieldDecorator } = this.props.form;
    const initData = { ...data };

    return (
      <Modal {...this.props} onOk={this.handleOk}>
        <Spin spinning={spinning || false}>
          <Form>
            <FormItem label="公司名称" {...formItemLayout}>
              <span className="ant-form-text">{initData.companyName}</span>
            </FormItem>
            <FormItem label="机组id" {...formItemLayout}>
              {getFieldDecorator('machineId', {
                initialValue: initData.machineId,
                rules: [
                  {
                    required: true,
                    message: '请输入机组id,只能输入[1-10]数字!',
                    type: 'integer',
                  },
                ],
              })(<InputNumber min={1} max={10} />)}
            </FormItem>
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('index', {
                initialValue: initData.index,
                rules: [
                  {
                    required: true,
                    message: '请输入名称!',
                  },
                ],
              })(
                <Select>
                  {mapIndex.map((value, index) => (
                    <Option key={value} value={index + 1}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="数据死区" {...formItemLayout}>
              {getFieldDecorator('deadband', {
                initialValue: initData.deadband || 0,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: '请输入数据死区,只能输入范围为[0-99999],小数只能包含两位的数字!',
                  },
                ],
              })(<InputNumber step={0.01} min={0} max={99999} />)}
            </FormItem>
            <FormItem label="数据值" {...formItemLayout}>
              {getFieldDecorator('value', {
                initialValue: initData.value,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: '请输入数据值,只能输入范围为[0-99999],小数只能包含两位的数字!',
                  },
                ],
              })(<InputNumber step={0.01} min={0} max={99999} />)}
            </FormItem>
            {!spinning && (
              <FormItem label="是否检查" {...formItemLayout}>
                {getFieldDecorator('isCheck', {
                  initialValue: initData.isCheck,
                })(
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked={initData.isCheck}
                  />
                )}
              </FormItem>
            )}
            <FormItem label="无变化失效" {...formItemLayout}>
              {getFieldDecorator('noChangeNum', {
                initialValue: initData.noChangeNum,
                rules: [
                  {
                    required: true,
                    type: 'integer',
                    message: '请输入无变化失效,只能输入范围为[0-99]的数字!',
                  },
                ],
              })(<InputNumber min={0} max={99} />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
