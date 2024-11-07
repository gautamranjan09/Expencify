import React, { useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddExpenseModal from "../components/Modals/AddExpenseModal";
import AddIncomeModal from "../components/Modals/AddIncomeModal";
import moment from "moment";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.appSlice.user);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (value, type) => {
    const newTransaction = {
      type: type,
      date: moment(value.date).format("YYYY-MM-DD"),
      amount: parseFloat(value.amount),
      tag: value.tag,
      name: value.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction (transaction){
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transaction`), transaction);
      console.log("Document written with ID: " , docRef.id);
      toast.success("Transaction Added!")
    }catch(e){
      console.log("error adding document:", e);
      toast.error("Couldn't add transaction");
    }
  }

  return (
    <div>
      <Header />
      <Cards
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />
      <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish} />
      <AddIncomeModal isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish} />
    </div>
  );
};

export default Dashboard;
