import React from "react";
import { Button, Modal, Form, Input, DatePicker, Select, Divider } from "antd";

function AddExpenseModal({isExpenseModalVisible, handleExpenseCancel, onFinish}){
  const [form] = Form.useForm();
  
  return (
    <Modal
      title="Add Expense"
      className="custom-modal"
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Divider  style={{ margin:"1rem 0"}}/>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 400}}
          labelCol={{ style: { padding: 0 } }}
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the Description of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" allowClear style={{ outline: 'none', boxShadow: 'none', padding:"0 0.4rem" }}/>
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 400 }}
          labelCol={{ style: { padding: 0 } }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the expense amount!" },
          ]}
        >
          <Input type="number" className="custom-input" allowClear style={{ outline: 'none', boxShadow: 'none', padding:"0 0.4rem" }}/>
        </Form.Item>

        <Form.Item
          label="Tag"
          labelCol={{ style: { padding: 0 } }}
          name="tag"
          style={{ fontWeight: 400 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2" allowClear>
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            <Select.Option value="others">Others</Select.Option>
            {/* Add more tags here */}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 400 }}
          labelCol={{ style: { padding: 0 } }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the expense date!" },
          ]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" style={{ outline: 'none', boxShadow: 'none', padding:"0 0.4rem" }}/>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0}}>
          <Button className="btn btn-blue" type="primary" htmlType="submit" style={{ width:"100%"}}>
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;
