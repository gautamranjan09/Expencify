import React, { useEffect, useState } from "react";
import "./style.css";
import Button from "../Button";
import { Card, Row, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteDoc, collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { setTransactions } from "../../redux/appSlice";
import { toast } from "react-toastify";
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const Cards = ({ showExpenseModal, showIncomeModal }) => {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.appSlice.transactions);
  const user = useSelector(state => state.appSlice.user);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const { incomeTotal, expenseTotal } = transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.incomeTotal += curr.amount;
      } else {
        acc.expenseTotal += curr.amount;
      }
      return acc;
    }, { incomeTotal: 0, expenseTotal: 0 });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
  }, [transactions]);

  const handleReset = async () => {
    confirm({
      title: 'Are you sure you want to reset your balance?',
      icon: <ExclamationCircleFilled />,
      content: 'This will permanently delete all your transactions. This action cannot be undone.',
      okText: 'Yes, Reset',
      okType: 'danger',
      cancelText: 'No, Cancel',
      async onOk() {
        try {
          // Get reference to user's transactions collection
          const transactionsRef = collection(db, `users/${user?.uid}/transactions`);
          const querySnapshot = await getDocs(query(transactionsRef));

          // Delete each transaction document
          const deletePromises = querySnapshot.docs.map(doc => 
            deleteDoc(doc.ref)
          );

          // Wait for all deletions to complete
          await Promise.all(deletePromises);

          // Update Redux store
          dispatch(setTransactions([]));

          toast.success("Balance reset successfully!");
        } catch (error) {
          console.error("Error resetting balance:", error);
          toast.error("Failed to reset balance: " + error.message);
        }
      },
    });
  };

  return (
    <Row className="my-row">
      <Card bordered={true} className="my-card">
        <h2>Current Balance</h2>
        <p>₹ {income - expense}</p>
        <Button 
          text="Reset Balance" 
          blue={true} 
          onClick={handleReset}
        />
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Income</h2>
        <p>₹ {income}</p>
        <Button 
          text="Add Income" 
          blue={true} 
          onClick={showIncomeModal}
        />
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Expenses</h2>
        <p>₹ {expense}</p>
        <Button 
          text="Add Expense" 
          blue={true} 
          onClick={showExpenseModal}
        />
      </Card>
    </Row>
  );
};

export default Cards;