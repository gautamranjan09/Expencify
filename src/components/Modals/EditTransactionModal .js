import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Divider } from "antd";
import { toast } from "react-toastify";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";

const { Option } = Select;

const EditTransactionModal = ({ isVisible, onClose, transaction, userId }) => {
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState(
    transaction?.type || "expense"
  );

  const incomeTags = ["freelance", "salary", "investment"];
  const expenseTags = ["food", "education", "office", "others"];

  useEffect(() => {
    if (transaction) {
      form.setFieldsValue({
        ...transaction,
        date: transaction.date ? dayjs(transaction.date) : null,
      });
    }
  }, [transaction, form]);

  const handleUpdate = async (values) => {
    try {
      const updatedTransaction = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        amount: parseFloat(values.amount),
      };

      const transactionRef = doc(
        db,
        `users/${userId}/transactions`,
        transaction.key
      );
      await updateDoc(transactionRef, updatedTransaction);

      toast.success("Transaction updated successfully!");
      onClose(true); // true indicates successful update
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction: " + error.message);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleTypeChange = (value) => {
    setTransactionType(value);
    // Clear the tag when transaction type changes
    form.setFieldValue("tag", undefined);
  };

  return (
    <Modal
      title="Edit Transaction"
      className="custom-modal"
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Divider style={{ margin: "1rem 0" }} />
      <Form form={form} onFinish={handleUpdate} layout="vertical">
        <Form.Item
          name="description"
          label="Description"
          labelCol={{ style: { padding: 0 } }}
          rules={[
            {
              required: true,
              message: "Please input the Description of the transaction!",
            },
          ]}
        >
          <Input
            className="custom-input"
            style={{ outline: "none", boxShadow: "none", padding: "0 0.4rem" }}
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          labelCol={{ style: { padding: 0 } }}
          rules={[
            {
              required: true,
              message: "Please select type of the transaction!",
            },
          ]}
        >
          <Select className="select-input-2" allowClear onChange={handleTypeChange}>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tag"
          label="Tag"
          labelCol={{ style: { padding: 0 } }}
          rules={[{ required: true, message: "Please select tag" }]}
        >
          <Select className="select-input-2" allowClear>
            {transactionType === "income"
              ? incomeTags.map((tag) => (
                  <Option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </Option>
                ))
              : expenseTags.map((tag) => (
                  <Option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </Option>
                ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          labelCol={{ style: { padding: 0 } }}
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <Input
            type="number"
            prefix="₹"
            allowClear
            className="custom-input"
            style={{ outline: "none", boxShadow: "none", padding: "0 0.4rem" }}
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          labelCol={{ style: { padding: 0 } }}
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker
            className="custom-input"
            style={{ outline: "none", boxShadow: "none", padding: "0 0.4rem" }}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            className="btn btn-blue"
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Update Transaction
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTransactionModal;
