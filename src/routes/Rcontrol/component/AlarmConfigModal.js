import React, { Component } from 'react';
import { Form, Select, Switch, Modal, Spin, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

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
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('alarmName', {
                initialValue: initData.alarmName,
                rules: [
                  {
                    required: true,
                    message: '请输入名称!',
                  },
                ],
              })(<Input max={50} />)}
            </FormItem>
            <FormItem label="级别" {...formItemLayout}>
              {getFieldDecorator('alarmLevel', {
                initialValue: initData.alarmLevel,
                rules: [
                  {
                    required: true,
                    message: '请选择级别!',
                  },
                ],
              })(
                <Select>
                  <Option value="low">低</Option>
                  <Option value="info">一般</Option>
                  <Option value="high">严重</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="接收端" {...formItemLayout}>
              {getFieldDecorator('alarmWay', {
                initialValue: initData.alarmWay,
                rules: [
                  {
                    required: true,
                    message: '只能输入0或1的8位数字!',
                    pattern: '^[01]{8}$',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="语音文件" {...formItemLayout}>
              {getFieldDecorator('voiceFile', {
                initialValue: initData.voiceFile,
              })(<Input max={250} />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('configState', {
                initialValue: initData.configState,
              })(<Switch defaultChecked={initData.configState} />)}
            </FormItem>
            <FormItem label="需要确认" {...formItemLayout}>
              {getFieldDecorator('isConfirm', {
                initialValue: initData.isConfirm,
              })(<Switch defaultChecked={initData.isConfirm} />)}
            </FormItem>
            <FormItem label="语音告警" {...formItemLayout}>
              {getFieldDecorator('isVoice', {
                initialValue: initData.isVoice,
              })(<Switch defaultChecked={initData.isVoice} />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
