import { useState, useEffect } from "react";
import API from "../api";

export default function ExpenseForm({ refresh, editExpense, setEditExpense, darkMode }) {
  const [data, setData] = useState({ title: "", amount: "", category: "", notes: "" });
  const categories = ["Food", "Travel", "Shopping", "Rent", "Entertainment", "Others"];

  // Populate form when editing
  useEffect(() => {
    if (editExpense) {
      setData({
        title: editExpense.title,
        amount: editExpense.amount,
        category: editExpense.category,
        notes: editExpense.notes || ""
      });
    }
  }, [editExpense]);

  const handleSubmit = async () => {
    if (!data.title || !data.amount || !data.category) return alert("Fill all fields");

    if (editExpense) {
      // Edit existing
      await API.put(`/api/expenses/${editExpense._id}`, { ...data, amount: Number(data.amount) });
      setEditExpense(null);
    } else {
      // Add new
      await API.post("/api/expenses", { ...data, amount: Number(data.amount), date: new Date() });
    }

    setData({ title: "", amount: "", category: "", notes: "" });
    refresh();
  };

  return (
    <div className={`card p-3 mb-3 shadow-sm ${darkMode ? "bg-secondary text-light" : "bg-light text-dark"}`}>
      <h5>{editExpense ? "Edit Expense" : "Add Expense"}</h5>
      <input
        className={`form-control mb-2 ${darkMode ? "bg-dark text-light border-light" : ""}`}
        placeholder="Title"
        value={data.title}
        onChange={e => setData({ ...data, title: e.target.value })}
      />
      <input
        type="number"
        className={`form-control mb-2 ${darkMode ? "bg-dark text-light border-light" : ""}`}
        placeholder="Amount"
        value={data.amount}
        onChange={e => setData({ ...data, amount: e.target.value })}
      />
      <select
        className={`form-select mb-2 ${darkMode ? "bg-dark text-light border-light" : ""}`}
        value={data.category}
        onChange={e => setData({ ...data, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
      </select>
      <input
        className={`form-control mb-2 ${darkMode ? "bg-dark text-light border-light" : ""}`}
        placeholder="Notes"
        value={data.notes}
        onChange={e => setData({ ...data, notes: e.target.value })}
      />
      <button className={`btn ${darkMode ? "btn-light text-dark" : "btn-success"}`} onClick={handleSubmit}>
        {editExpense ? "Update" : "Add"}
      </button>
      {editExpense && (
        <button className={`btn ms-2 ${darkMode ? "btn-dark text-light" : "btn-secondary"}`} onClick={() => setEditExpense(null)}>
          Cancel
        </button>
      )}
    </div>
  );
}
