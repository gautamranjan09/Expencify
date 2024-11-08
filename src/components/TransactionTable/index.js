import React from "react";
import { Table, Tag, Space, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const TransactionTable = () => {
  const transactions = useSelector((state) => state.appSlice.transactions);
  //   {
  //     key: '0',
  //     type: 'expense',
  //     tag: 'education',
  //     amount: 500,
  //     name: 'GAUTAM RANJAN',
  //     date: '2024-11-08',
  //   },
  //   {
  //     key: '1',
  //     type: 'income',
  //     tag: 'salary',
  //     amount: 10000,
  //     name: 'GAUTAM RANJAN',
  //     date: '2024-11-07',
  //   },
  //   {
  //     key: '2',
  //     type: 'expense',
  //     tag: 'office',
  //     amount: 500,
  //     name: 'GAUTAM RANJAN',
  //     date: '2024-11-08',
  //   },
  //   {
  //     key: '3',
  //     type: 'expense',
  //     tag: 'food',
  //     amount: 700,
  //     name: 'GAUTAM RANJAN',
  //     date: '2024-11-08',
  //   },
  //   {
  //     key: '4',
  //     type: 'income',
  //     tag: 'freelance',
  //     amount: 600,
  //     name: 'GAUTAM RANJAN',
  //     date: '2024-11-08',
  //   },
  //   {
  //     key: '5',
  //     type: 'expense',
  //     tag: 'education',
  //     amount: 400,
  //     name: 'GAUTAM RANJAN',
  //     date: '2024-11-08',
  //   },
  //   {
  //     key: '6',
  //     type: 'expense',
  //     tag: 'food',
  //     amount: 100,
  //     name: 'GAUTAM RANJAN',
  //     date: '2024-11-07',
  //   },
  //   {
  //     key: '7',
  //     type: 'income',
  //     tag: 'investment',
  //     amount: 200,
  //     name: 'GAUTAM RANJAN',
  //     date: '2024-11-08',
  //   },
  // ];

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "income" ? "green" : "volcano"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (tag) => <Tag color="geekblue">{tag.toUpperCase()}</Tag>,
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span style={{ color: record.type === "income" ? "green" : "red" }}>
          ₹ {amount}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.key)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="danger"
              color="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (key) => {
    console.log(`Edit action triggered for key: ${key}`);
    // Implement edit logic (e.g., open a modal with a form)
  };

  const handleDelete = (key) => {
    console.log(`Delete action triggered for key: ${key}`);
    // Implement delete logic (e.g., confirmation dialog and data removal)
  };

  return (
    <Table
      dataSource={transactions}
      columns={columns}
      bordered
      pagination={{ pageSize: 5 }}
    />
  );
};

export default TransactionTable;
