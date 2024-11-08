import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddExpenseModal from "../components/Modals/AddExpenseModal";
import AddIncomeModal from "../components/Modals/AddIncomeModal";
import moment from "moment";
import { toast } from "react-toastify";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.appSlice.user);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(null);
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

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user?.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!");
    } catch (e) {
      console.log("error adding document:", e);
      toast.error("Couldn't add transaction");
    }
  }

  useEffect(()=>{
    setLoading(true);
    const q = query(collection(db, `users/${user?.uid}/transactions`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      setTransactions(transactionsArray);
      setLoading(false);
      console.log("tramsactions array", transactionsArray, transactions);
      toast.success("Transactions Fetched!")
    });

    return () => {
      unsubscribe();
    }; // Cleanup on unmount
  },[]);

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;