import React, { useState } from "react";
import { Table, Tag, Space, Button, Tooltip, Select, Radio } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Option } from "antd/es/mentions";

const TransactionTable = () => {
  const transactions = useSelector((state) => state.appSlice.transactions);
  const [sortKey, setSortKey] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

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
      //render: (date) => <span>{new Date(date).toLocaleDateString()}</span>,
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

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(search.toLowerCase()) &&
      transaction.type.includes(typeFilter)
  );

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") return new Date(a.date) - new Date(b.date);
    else if (sortKey === "amount") return a.amount - b.amount;
    else return 0;
  });

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by description"
      />
      <Select
        className="select-input"
        value={typeFilter}
        onChange={(value) => setTypeFilter(value)}
        placeholder="Filter"
        allowClear
      >
        <Option value="">All</Option>
        <Option value="income">Income</Option>
        <Option value="expense">Expense</Option>
      </Select>
      <Radio.Group className="input-radio" onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
        <Radio.Button value="">No Sort</Radio.Button>
        <Radio.Button value="date">Sort by Date</Radio.Button>
        <Radio.Button value="amount">Sort by Amount</Radio.Button>
      </Radio.Group>
      <Table
        dataSource={sortedTransactions}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </>
  );
};

export default TransactionTable;
