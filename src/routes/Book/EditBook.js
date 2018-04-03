import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Card,
    InputNumber,
    Radio,
    Icon,
    Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const {TextArea} = Input;

@connect(({loading}) => ({submitting: loading.effects['form/submitRegularForm']}))
@Form.create()
export default class EditBook extends PureComponent {
    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 7,
                },
            },
            wrapperCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 12,
                },
                md: {
                    span: 10,
                },
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 2,
                    offset: 10,
                },
            },
        };
        return (
          <PageHeaderLayout title="编辑图书信息" content="毛主席教导我们">
            <Card bordered={false}>
              <Form
                onSubmit={this.handleSubmit}
                hideRequiredMark
                style={{
                        marginTop: 8,
                    }}
              >
                <FormItem label="书名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入书名',
                                    },
                                ],
                                // initialValue: editTarget.name
                            },)(<Input type="text" />)}
                </FormItem>
                <FormItem label="价格" {...formItemLayout}>
                  {getFieldDecorator('price', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入价格',
                                    }, {
                                        min: 1,
                                        max: 999,
                                        type: 'number',
                                        message: 'please input 1~999 number',
                                    },
                                ],
                                // initialValue: editTarget.price
                            })(<InputNumber />)}
                </FormItem>
                <FormItem label="所有者" {...formItemLayout}>
                  {getFieldDecorator('owner_id', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入所有者',
                                    },
                                ],
                                // initialValue: editTarget.owner_id
                            })(<Input type="text" />)}

                </FormItem>
                <FormItem
                  {...submitFormLayout}
                  style={{
                            marginTop: 32,
                        }}
                >
                  <Button type="primary" htmlType="submit">
                                保存
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </PageHeaderLayout>
        )
    }
}