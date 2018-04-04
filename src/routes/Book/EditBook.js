import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, Select, Button, Card, InputNumber } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ book, loading }) => ({ book, loading: loading.models.book }))
@Form.create()
export default class EditBook extends PureComponent {
	componentDidMount() {
		const { dispatch, match: { params: { id } = {} } = {} } = this.props;
		if (id) {
			dispatch({ type: 'book/getBook', id });
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		const { form } = this.props;

		form.validateFields((err, values) => {
			if (err) {
				return false;
			}

			const { id } = values;
			const { dispatch } = this.props;
			if (id) {
				dispatch({ type: 'book/update', data: values });
			}
		});
	}

	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
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
					span: 4,
					offset: 10,
				},
			},
		};
		const { book: { editTarget } = {} } = this.props;
		return (
			<PageHeaderLayout title="编辑图书信息" content="毛主席教导我们">
				<Card bordered={false}>
					<Form
						onSubmit={this.handleSubmit.bind(this)}
						hideRequiredMark
						style={{
							marginTop: 8,
						}}
					>
						<FormItem>
							{getFieldDecorator('id', {
								initialValue: editTarget ? editTarget.id : '',
							})(<input type="hidden" />)}
						</FormItem>
						<FormItem label="书名" {...formItemLayout}>
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: '请输入书名',
									},
								],
								initialValue: editTarget ? editTarget.name : '',
							})(<Input type="text" />)}
						</FormItem>
						<FormItem label="价格" {...formItemLayout}>
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
								initialValue: editTarget ? editTarget.price : '',
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
								initialValue: editTarget ? editTarget.owner_id : '',
							})(<Input type="text" />)}
						</FormItem>
						<FormItem {...submitFormLayout}>
							<Button type="primary" htmlType="submit">
								保存
							</Button>
							<Button
								style={{ marginLeft: 2 }}
								type="primary"
								htmlType="button"
								onClick={() => this.props.history.goBack()}
							>
								返回
							</Button>
						</FormItem>
					</Form>
				</Card>
			</PageHeaderLayout>
		);
	}
}
