import { useState, useEffect, useContext } from "react";
import IncomeForm from "../components/IncomeForm";
import ExpenseForm from "../components/ExpenseForm";
import IncomeFilters from "../components/IncomeFilters";
import ExpenseFilters from "../components/ExpenseFilters";
import Navbar from "../components/Navbar";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { CSVLink } from "react-csv";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const { isAuthenticated } = useContext(AuthContext);
const navigate = useNavigate();

useEffect(() => {
  if (!isAuthenticated) {
    navigate("/");
  }
}, [isAuthenticated, navigate]);

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [incomeList, setIncomeList] = useState([]);

  const [editExpense, setEditExpense] = useState(null);
  const [editIncome, setEditIncome] = useState(null);

  // Expense filters
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseMonth, setExpenseMonth] = useState("");

  // Income filters
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeMonth, setIncomeMonth] = useState("");

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Rent",
    "Entertainment",
    "Others"
  ];
  const incomeSources = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Others"
  ];
  
  /* ================= LOAD DATA ================= */
  const loadExpenses = async () => {
    const res = await API.get("/api/expenses");
    setExpenses(res.data);
  };

  const loadIncome = async () => {
    const res = await API.get("/api/income");
    setIncomeList(res.data);
  };

  useEffect(() => {
    loadExpenses();
    loadIncome();
  }, []);

  /* ================= FILTERED DATA ================= */
  const filteredExpenses = expenses.filter((exp) => {
    const matchCategory = expenseCategory
      ? exp.category === expenseCategory
      : true;
    const matchMonth = expenseMonth
      ? exp.date.startsWith(expenseMonth)
      : true;
    return matchCategory && matchMonth;
  });

  const filteredIncome = incomeList.filter((inc) => {
    const matchSource = incomeSource
      ? inc.source === incomeSource
      : true;
    const matchMonth = incomeMonth
      ? inc.date.startsWith(incomeMonth)
      : true;
    return matchSource && matchMonth;
  });

  /* ================= CALCULATIONS ================= */
  const totalExpenses = filteredExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const totalIncome = filteredIncome.reduce(
    (sum, i) => sum + i.amount,
    0
  );

  const balance = totalIncome - totalExpenses;

  /* ================= HANDLERS ================= */
  const handleExpenseDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      await API.delete(`/api/expenses/${id}`);
      loadExpenses();
    }
  };

  const handleIncomeDelete = async (id) => {
    if (window.confirm("Delete this income?")) {
      await API.delete(`/api/income/${id}`);
      loadIncome();
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  /* ================= CHART DATA ================= */
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: categories.map((cat) =>
          filteredExpenses
            .filter((e) => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40"
        ]
      }
    ]
  };

   const incomeChartData = {
    labels: incomeSources,
    datasets: [
      {
        data: incomeSources.map(src =>
          incomeList
            .filter(i => i.source === src)
            .reduce((sum, i) => sum + i.amount, 0)
        ),
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
          "#9C27B0",
          "#607D8B"
        ]
      }
    ]
  };

  /* ================= CSV ================= */
  const expenseCSV = filteredExpenses.map((e) => ({
    Title: e.title,
    Amount: e.amount,
    Category: e.category,
    Date: new Date(e.date).toLocaleDateString(),
    Notes: e.notes || ""
  }));
  const incomeCSV = filteredIncome.map((i) => ({
  Source: i.source,
  Amount: i.amount,
  Date: new Date(i.date).toLocaleDateString(),
  Notes: i.notes || ""
}));


  /* ================= UI HELPERS ================= */
  const badgeColor = (category) => {
    switch (category) {
      case "Food":
        return "bg-danger";
      case "Travel":
        return "bg-primary";
      case "Shopping":
        return "bg-warning text-dark";
      case "Rent":
        return "bg-info text-dark";
      case "Entertainment":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className={
        darkMode
          ? "bg-dark text-light min-vh-100"
          : "bg-light text-dark min-vh-100"
      }
    >
      <Navbar
        logout={logout}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />

      <div className="container my-4">

        {/* ================= SUMMARY ================= */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card bg-success text-white shadow-sm">
              <div className="card-body">
                <h5>Income</h5>
                <h3>₹{totalIncome}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-danger text-white shadow-sm">
              <div className="card-body">
                <h5>Expenses</h5>
                <h3>₹{totalExpenses}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-primary text-white shadow-sm">
              <div className="card-body">
                <h5>Balance</h5>
                <h3>₹{balance}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FORMS ================= */}
        <div className="row mb-4">
          <div className="col-md-6">
            <IncomeForm
              refresh={loadIncome}
              editIncome={editIncome}
              setEditIncome={setEditIncome}
              darkMode={darkMode}
            />
          </div>

          <div className="col-md-6">
            <ExpenseForm
              refresh={loadExpenses}
              editExpense={editExpense}
              setEditExpense={setEditExpense}
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* ================= INCOME FILTER ================= */}
        <IncomeFilters
          setSource={setIncomeSource}
          setMonth={setIncomeMonth}
        />
        
        {/* ================= INCOME TABLE ================= */}
        <div className={`card p-3 shadow-sm mb-4 ${darkMode ? "bg-secondary text-light" : "bg-light text-dark"}`}>
          <h5>Income List</h5>
          <div className="table-responsive">
            <table className={`table ${darkMode ? "table-dark table-hover" : "table-hover"}`}>
              <thead className={darkMode ? "" : "table-dark"}>
                <tr>
                  <th>Source</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncome.map((inc) => (
                  <tr key={inc._id}>
                    <td><span className="badge bg-success">{inc.source}</span></td>
                    <td>₹{inc.amount}</td>
                    <td>{new Date(inc.date).toLocaleDateString()}</td>
                    <td>{inc.notes || "-"}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => setEditIncome(inc)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleIncomeDelete(inc._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredIncome.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No income found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= EXPENSE FILTER ================= */}
        <ExpenseFilters
          setCategory={setExpenseCategory}
          setMonth={setExpenseMonth}
        />

        {/* ================= EXPENSE TABLE ================= */}
        <div className={`card p-3 shadow-sm mb-4 ${darkMode ? "bg-secondary text-light" : "bg-light text-dark"}`}>
          <h5>Expense List</h5>
          <div className="table-responsive">
            <table className={`table ${darkMode ? "table-dark table-hover" : "table-hover"}`}>
              <thead className={darkMode ? "" : "table-dark"}>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>{exp.title}</td>
                    <td>₹{exp.amount}</td>
                    <td><span className={`badge ${badgeColor(exp.category)}`}>{exp.category}</span></td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>{exp.notes || "-"}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => setEditExpense(exp)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleExpenseDelete(exp._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">No expenses found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= CHARTS ================= */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className={`card p-3 shadow-sm ${darkMode ? "bg-secondary text-light" : "bg-light text-dark"}`}>
              <h5 className="text-center">Expenses by Category (Pie)</h5>
              <Pie data={chartData} />
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card p-3 shadow-sm ${darkMode ? "bg-secondary text-light" : "bg-light text-dark"}`}>
              <h5 className="text-center">Income by Source</h5>
              <Pie data={incomeChartData} />
            </div>
          </div>
        </div>

        {/* ================= CSV EXPORT BUTTONS ================= */}
<div className="d-flex gap-2 mb-4 flex-wrap">
  <CSVLink
    data={expenseCSV}
    filename="expenses.csv"
    className={`btn ${darkMode ? "btn-light text-dark" : "btn-success"}`}
  >
    Export Expenses CSV
  </CSVLink>

  <CSVLink
    data={incomeCSV}
    filename="income.csv"
    className={`btn ${darkMode ? "btn-light text-dark" : "btn-primary"}`}
  >
    Export Income CSV
  </CSVLink>
</div>

      </div>
    </div>
  );
}
