import React from "react";
import { Button, Modal, Form, Input, DatePicker, Select, Divider } from "antd";

function AddIncomeModal({isIncomeModalVisible, handleIncomeCancel, onFinish}) {
  const [form] = Form.useForm();
  
  return (
    <Modal
      className="custom-modal"
      title="Add Income"
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Divider  style={{ margin:"1rem 0"}}/>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "income");
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 400 }}
          label="Description"
          labelCol={{ style: { padding: 0 } }}
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the Description of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" style={{ outline: 'none', boxShadow: 'none', padding:"0 0.4rem" }} />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 400 }}
          label="Amount"
          labelCol={{ style: { padding: 0 } }}
          name="amount"
          rules={[
            { required: true, message: "Please input the income amount!" },
          ]}
        >
          <Input type="number" className="custom-input" style={{ outline: 'none', boxShadow: 'none', padding:"0 0.4rem" }}/>
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 400 }}
          label="Date"
          labelCol={{ style: { padding: 0 } }}
          name="date"
          rules={[
            { required: true, message: "Please select the income date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" style={{ outline: 'none', boxShadow: 'none', padding:"0 0.4rem" }}/>
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 400 }}
          label="Tag"
          labelCol={{ style: { padding: 0 } }}
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2" >
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            {/* Add more tags here */}
          </Select>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0}}>
          <Button className="btn btn-blue" type="primary" style={{ width:"100%"}} htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;
