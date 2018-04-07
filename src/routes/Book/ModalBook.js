import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Modal, Input, InputNumber } from 'antd';

const { Item: FormItem } = Form;

@connect(({ book, loading }) => ({ book, loading: loading.models.book }))
@Form.create()
export default class ModalBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  setVisible(visible) {
    this.setState({
      visible,
    });
    if (visible) {
      const { dispatch, dataId } = this.props;
      if (dataId) {
        dispatch({ type: 'book/getBook', id: dataId });
      }
    }
  }

  okHandle() {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (onOk) {
          onOk(values);
        }
        this.setVisible(false);
      }
    });
  }

  render() {
    const { children, book: { editTarget }, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    return (
      <Fragment>
        <span onClick={this.setVisible.bind(this, true)}>{children}</span>
        <Modal
          confirmLoading={loading}
          title="edit user"
          visible={visible}
          onCancel={this.setVisible.bind(this, false)}
          onOk={this.okHandle.bind(this)}
        >
          <Form>
            <FormItem>
              {getFieldDecorator('id', {
                initialValue: editTarget.id,
              })(<Input type="hidden" />)}
            </FormItem>
            <FormItem label="书名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入书名',
                  },
                ],
                initialValue: editTarget.name,
              })(<Input type="text" />)}
            </FormItem>
            <FormItem label="价格">
              {getFieldDecorator('price', {
                rules: [
                  {
                    required: true,
                    message: '请输入价格',
                  },
                  {
                    min: 1,
                    max: 999,
                    type: 'number',
                    message: 'please input 1~999 number',
                  },
                ],
                initialValue: editTarget.price,
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="所有者">
              {getFieldDecorator('owner_id', {
                rules: [
                  {
                    required: true,
                    message: '请输入所有者',
                  },
                ],
                initialValue: editTarget.owner_id,
              })(<Input type="text" />)}
            </FormItem>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}
