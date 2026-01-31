const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* =======================
   DATABASE CONNECTION
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  });

/* =======================
   SCHEMAS & MODELS
======================= */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const ExpenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: String
  },
  { timestamps: true }
);

const IncomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, required: true }, // dropdown value
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: String
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const Expense = mongoose.model("Expense", ExpenseSchema);
const Income = mongoose.model("Income", IncomeSchema);

/* =======================
   AUTH MIDDLEWARE
======================= */
const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* =======================
   AUTH ROUTES
======================= */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   INCOME ROUTES (NEW)
======================= */
app.get("/api/income", auth, async (req, res) => {
  const income = await Income.find({ user: req.userId }).sort({ date: -1 });
  res.json(income);
});

app.post("/api/income", auth, async (req, res) => {
  const { source, amount, date, notes } = req.body;
  if (!source || !amount)
    return res.status(400).json({ message: "Missing fields" });

  const income = await Income.create({
    user: req.userId,
    source,
    amount: Number(amount),
    date,
    notes
  });

  res.json(income);
});

app.put("/api/income/:id", auth, async (req, res) => {
  const income = await Income.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(income);
});

app.delete("/api/income/:id", auth, async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.json({ message: "Income deleted" });
});

/* =======================
   EXPENSE ROUTES
======================= */
app.get("/api/expenses", auth, async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
  res.json(expenses);
});

app.post("/api/expenses", auth, async (req, res) => {
  const { title, amount, category, date, notes } = req.body;
  if (!title || !amount || !category)
    return res.status(400).json({ message: "Missing fields" });

  const expense = await Expense.create({
    user: req.userId,
    title,
    amount: Number(amount),
    category,
    date,
    notes
  });

  res.json(expense);
});

app.put("/api/expenses/:id", auth, async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(expense);
});

app.delete("/api/expenses/:id", auth, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted" });
});

// For the name near Expense Tracker 
app.get("/api/auth/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
