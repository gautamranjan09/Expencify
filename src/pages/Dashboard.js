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
import { useDispatch, useSelector } from "react-redux";
import { setInitialFetchDone, setTransactions } from "../redux/appSlice";
import TransactionTable from "../components/TransactionTable";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";
import { DotLoader } from "react-spinners";

const Dashboard = () => {
  const user = useSelector((state) => state.appSlice.user);
  const transactions = useSelector((state) => state.appSlice.transactions) || [];
  const isInitialFetchDone = useSelector(
    (state) => state.appSlice.isInitialFetchDone
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
      date: value.date.format("YYYY-MM-DD"),
      amount: parseFloat(value.amount),
      tag: value.tag,
      description: value.description,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user?.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
    } catch (e) {
      console.log("error adding document:", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, `users/${user?.uid}/transactions`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        key: doc.id,
      }));

      dispatch(setTransactions(transactionsArray));
      //setTransactions(transactionsArray);
      setLoading(false);
      console.log("tramsactions array", transactionsArray);
      // Only show toast on initial fetch
      if (!isInitialFetchDone) {
        toast.success("Transactions Loaded Successfully!");
        dispatch(setInitialFetchDone(true));
      }
    });

    return () => {
      unsubscribe();
    }; // Cleanup on unmount
  }, [user?.uid, dispatch, isInitialFetchDone]);

  const sortedTransactions = transactions
    ? [...transactions].sort((a, b) => {
        if (!a || !b) return 0;
        return new Date(a.date || 0) - new Date(b.date || 0);
      })
    : [];

  return (
    <>
    <Header />
    <div className="dashboard-container">
      
      {loading ? (
        <div className="loader-wrapper">
        <DotLoader color="#2970ff" />
        </div>
      ) : (
        <>
        <div className="card-wrapper">
          <Cards
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          </div>
          <div className="charts-wrapper">
            {transactions.length != 0 ? (
              <ChartComponent sortedTransactions={sortedTransactions} />
            ) : (
              <NoTransactions />
            )}
          </div>
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
          <div className="charts-wrapper">
          <TransactionTable addTransaction={addTransaction} />
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default Dashboard;
