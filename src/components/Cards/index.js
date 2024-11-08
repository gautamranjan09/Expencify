import React, { useEffect, useState } from "react";
import "./style.css";
import Button from "../Button";
import { Card, Row } from "antd";
import { useSelector } from "react-redux";

const Cards = ({ showExpenseModal, showIncomeModal }) => {
  const transactions = useSelector(state => state.appSlice.transactions);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(()=>{
    const{incomeTotal, expenseTotal} = transactions.reduce((acc, curr) => {
      if(curr.type === 'income'){
        acc.incomeTotal += curr.amount;
      }else {
        acc.expenseTotal += curr.amount;
      }
      return acc;
    },{incomeTotal:0, expenseTotal:0});

    setIncome(incomeTotal);
    setExpense(expenseTotal);
  },[]);


  return (
    <Row className="my-row">
      <Card bordered={true} className="my-card" >
        <h2>Current Balance</h2>
        <p>₹ {income-expense}</p>
        <Button text="Reset Balance" blue={true}/>
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Income</h2>
        <p>₹ {income}</p>
        <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Expenses</h2>
        <p>₹ {expense}</p>
        <Button text="Add Expense" blue={true} onClick={showExpenseModal}/>
      </Card>
    </Row>
  );
};

export default Cards;
