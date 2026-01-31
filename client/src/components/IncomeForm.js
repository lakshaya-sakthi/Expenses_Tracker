import { useState, useEffect } from "react";
import API from "../api";

export default function IncomeForm({ refresh, editIncome, setEditIncome, darkMode }) {
  const [data, setData] = useState({
    source: "",
    amount: "",
    notes: ""
  });

  const sources = [
    "Salary",
    "Freelance",
    "Business",
    "Investments",
    "Rental",
    "Other"
  ];

  // Populate form when editing
  useEffect(() => {
    if (editIncome) {
      setData({
        source: editIncome.source,
        amount: editIncome.amount,
        notes: editIncome.notes || ""
      });
    }
  }, [editIncome]);

  const handleSubmit = async () => {
    if (!data.source || !data.amount) {
      return alert("Fill all fields");
    }

    if (editIncome) {
      await API.put(`/api/income/${editIncome._id}`, {
        ...data,
        amount: Number(data.amount)
      });
      setEditIncome(null);
    } else {
      await API.post("/api/income", {
        ...data,
        amount: Number(data.amount),
        date: new Date()
      });
    }

    setData({ source: "", amount: "", notes: "" });
    refresh();
  };

  return (
    <div
      className={`card p-3 mb-3 shadow-sm ${
        darkMode ? "bg-secondary text-light" : "bg-light text-dark"
      }`}
    >
      <h5>{editIncome ? "Edit Income" : "Add Income"}</h5>

      {/* Source Dropdown */}
      <select
        className={`form-select mb-2 ${
          darkMode ? "bg-dark text-light border-light" : ""
        }`}
        value={data.source}
        onChange={(e) => setData({ ...data, source: e.target.value })}
      >
        <option value="">Select Income Source</option>
        {sources.map((src, idx) => (
          <option key={idx} value={src}>
            {src}
          </option>
        ))}
      </select>

      <input
        type="number"
        className={`form-control mb-2 ${
          darkMode ? "bg-dark text-light border-light" : ""
        }`}
        placeholder="Amount"
        value={data.amount}
        onChange={(e) => setData({ ...data, amount: e.target.value })}
      />

      <input
        className={`form-control mb-2 ${
          darkMode ? "bg-dark text-light border-light" : ""
        }`}
        placeholder="Notes"
        value={data.notes}
        onChange={(e) => setData({ ...data, notes: e.target.value })}
      />

      <button
        className={`btn ${
          darkMode ? "btn-light text-dark" : "btn-success"
        }`}
        onClick={handleSubmit}
      >
        {editIncome ? "Update" : "Add"}
      </button>

      {editIncome && (
        <button
          className={`btn ms-2 ${
            darkMode ? "btn-dark text-light" : "btn-secondary"
          }`}
          onClick={() => setEditIncome(null)}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
