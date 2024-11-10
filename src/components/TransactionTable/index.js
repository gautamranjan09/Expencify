import React, { useState } from "react";
import "./style.css";
import { Table, Tag, Space, Button, Tooltip, Select, Radio } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Option } from "antd/es/mentions";
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
import { deleteDoc } from "firebase/firestore";
import { db, doc } from "../../firebase";
import EditTransactionModal from "../Modals/EditTransactionModal ";

const TransactionTable = ({ addTransaction }) => {
  const user = useSelector((state) => state.appSlice.user);
  const transactions = useSelector((state) => state.appSlice.transactions) || [];
  const [sortKey, setSortKey] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "name",
      render: (text) => <strong>{text || "No description"}</strong>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "income" ? "green" : "volcano"}>
          {(type || "unknown").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (tag) => <Tag color="geekblue">{(tag || "untagged").toUpperCase()}</Tag>,
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span style={{ color: record.type === "income" ? "green" : "red" }}>
          ₹ {amount || 0}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="danger"
              color="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.key, record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingTransaction(record);
    setIsEditModalVisible(true);
  };

  const handleModalClose = (wasUpdated = false) => {
    setIsEditModalVisible(false);
    setEditingTransaction(null);
    if (wasUpdated) {
      // Optionally refresh your transactions data here if needed
    }
  };

  const handleDelete = async (key, transactionDetails) => {
    const { description, type, tag, amount, date } = transactionDetails;
  
    try {
      console.log(`Delete action triggered for key: ${key}`);
      await deleteDoc(doc(db, `users/${user?.uid}/transactions`, key));
      toast.success(`Transaction deleted successfully: 
        ${type} - ${description} ₹${amount} on ${new Date(date).toLocaleDateString()}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(`Failed to delete the transaction: 
        ${type} - ${description} [${tag}] ₹${amount} on ${new Date(date).toLocaleDateString()}`);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (!transaction) return false;
    
    const descriptionMatch = !search || 
      (transaction.description && 
       transaction.description.toLowerCase().includes(search.toLowerCase()));
    
    const typeMatch = !typeFilter || 
      (transaction.type && 
       transaction.type.includes(typeFilter));
    
    return descriptionMatch && typeMatch;
  });

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (!a || !b) return 0;
    
    if (sortKey === "date") {
      return new Date(a.date || 0) - new Date(b.date || 0);
    } else if (sortKey === "amount") {
      return (a.amount || 0) - (b.amount || 0);
    }
    return 0;
  });

  function exportCSV() {
    const csvData = transactions.map(t => ({
      type: t?.type || '',
      date: t?.date || '',
      tag: t?.tag || '',
      description: t?.description || '',
      amount: t?.amount || 0
    }));

    var csv = unparse({
      fields: ["type", "date", "tag", "description", "amount"],
      data: csvData
    });
    var data = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var csvURL = window.URL.createObjectURL(data);
    var tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "transactions.csv");
    tempLink.click();
    window.URL.revokeObjectURL(csvURL);
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
      const file = event.target.files[0];
      if (!file) {
        toast.error("Please select a file");
        return;
      }

      // Show initial loading toast
      const loadingToast = toast.loading("Importing transactions...");

      parse(file, {
        header: true,
        complete: async function(results) {
          try {
            const totalTransactions = results.data.length;
            let successCount = 0;

            for (const transaction of results.data) {
              if (!transaction.type || !transaction.amount) continue;
              
              const newTransaction = {
                ...transaction,
                amount: parseFloat(transaction.amount) || 0,
                date: transaction.date || new Date().toISOString().split('T')[0],
                description: transaction.description || '',
                tag: transaction.tag || 'others'
              };

              await addTransaction(newTransaction, true);
              successCount++;
            }

            // Update the loading toast with success message
            toast.update(loadingToast, {
              render: `Successfully imported ${successCount} of ${totalTransactions} transactions`,
              type: "success",
              isLoading: false,
              autoClose: 3000
            });

          } catch (error) {
            // Update the loading toast with error message
            toast.update(loadingToast, {
              render: "Error importing transactions: " + error.message,
              type: "error",
              isLoading: false,
              autoClose: 3000
            });
          }
        },
        error: function(error) {
          toast.error("Error reading CSV file: " + error.message);
        }
      });
      
      // Reset file input
      event.target.value = null;
      
    } catch (e) {
      toast.error("Error importing file: " + e.message);
    }
  }

  return (
    <div  style={{ width: "95%", padding: "0rem 2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} width="16" alt="search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by description"
          />
        </div>

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
      </div>
      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              width: "250px",
            }}
          >
            <button className="btn" onClick={exportCSV}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          bordered
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}

        />
      </div>
      <EditTransactionModal 
        isVisible={isEditModalVisible}
        onClose={handleModalClose}
        transaction={editingTransaction}
        userId={user?.uid}
      />
    </div>
  );
};

export default TransactionTable;