import React, { useMemo } from "react";
import { Line, Pie } from "@ant-design/charts";
import "./style.css";

const ChartComponent = ({ sortedTransactions }) => {
  // Memoize the balance calculations to prevent unnecessary recalculations
  const balanceData = useMemo(() => {
    // Create a deep copy and sort by date
    const chronologicalTransactions = [...sortedTransactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let runningBalance = 0;
    return chronologicalTransactions.map((transaction) => {
      runningBalance +=
        transaction.type === "income"
          ? Number(transaction.amount)
          : -Number(transaction.amount);

      return {
        date: transaction.date,
        balance: runningBalance,
        type: transaction.type,
      };
    });
  }, [sortedTransactions]);

  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type === "expense")
      return { tag: transaction.tag, amount: transaction.amount };
  });
  
  const finalSpendings = spendingData.reduce((acc, current) => {
    if (!acc[current.tag]) {
      acc[current.tag] = { tag: current.tag, amount: current.amount };
    } else {
      acc[current.tag].amount += current.amount;
    }
    return acc;
  }, {});
  
  const finalSpendingsArray = Object.values(finalSpendings);
  
  // Step 1: Calculate total expense
  const totalExpense = finalSpendingsArray.reduce((sum, item) => sum + item.amount, 0);
  
  // Step 2: Add percentage to each item in finalSpendingsArray
  const finalSpendingsWithPercent = finalSpendingsArray.map(item => {
    const percent = ((item.amount / totalExpense) * 100).toFixed(2);
    return {
      tag: item.tag.charAt(0).toUpperCase() + item.tag.slice(1),
      amount: item.amount,
      percent: `${percent}%`
    };
  });
  

  const config = {
    data: balanceData,
    height: 400,
    smooth: true,
    autoFit: true,
    xField: "date",
    yField: "balance",
    point: {
      size: 5,
      shape: "square",
      style: {
        fill: "white",
        stroke: "#87080e",
        lineWidth: 2,
      },
    },
    xAxis: {
      type: "time",
      tickCount: 5,
      label: {
        style: {
          fontSize: 12,
          fontFamily: "Arial",
        },
        formatter: (v) => {
          const date = new Date(v);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        },
      },
      line: {
        style: {
          stroke: "#aaa",
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `₹${v.toLocaleString()}`,
        style: {
          fontSize: 12,
          fontFamily: "Arial",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#eee",
            lineDash: [4, 4],
          },
        },
      },
    },

    interaction: {
      tooltip: {
        domStyles: {
          "g2-tooltip": {
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
          },
          "g2-tooltip-title": {
            color: "#fff",
            fontSize: "14px",
            marginBottom: "8px",
          },
          "g2-tooltip-list-item": {
            color: "#fff",
            fontSize: "12px",
            marginBottom: "4px",
          },
        },

        formatter: (datum) => {
          return {
            name: "Balance",
            value: `₹${datum.balance}`,
          };
        },
      },
    },
    color: "#87080e",
    lineStyle: {
      lineWidth: 3,
    },
    animations: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
  };

  const spendingConfig = {
    data: finalSpendingsWithPercent,
    angleField: "amount",
    colorField: "tag",
    label: {
      text: ({ tag, percent }) => {
        return `${tag}: ${percent}`;
      },
      fill: '#fff',
      fontSize: 15,
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  return (
    <div className="chart-outer-container">
      <div className="chart-container">
        <h2 className="chart-title">Balance Over Time</h2>
        <div className="chart-inner-container">
          <Line {...config} />
        </div>
      </div>
      <div className="chart-container">
        <h2 className="chart-title">Your Spendings</h2>
        <div className="chart-inner-container">
          <Pie {...spendingConfig} />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
