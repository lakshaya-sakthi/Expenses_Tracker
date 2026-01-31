import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";

const COLORS = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1"];

export default function Charts({ expenses }) {
  // CATEGORY DATA
  const categoryData = Object.values(
    expenses.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
      acc[e.category].value += e.amount;
      return acc;
    }, {})
  );

  // MONTHLY DATA
  const monthlyData = Object.values(
    expenses.reduce((acc, e) => {
      const month = new Date(e.date).toLocaleString("default", { month: "short" });
      acc[month] = acc[month] || { month, amount: 0 };
      acc[month].amount += e.amount;
      return acc;
    }, {})
  );

  return (
    <div className="row mt-4">
      <div className="col-md-6 text-center">
        <h5>Category-wise Expenses</h5>
        <PieChart width={300} height={300}>
          <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100}>
            {categoryData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="col-md-6 text-center">
        <h5>Monthly Expenses</h5>
        <BarChart width={350} height={300} data={monthlyData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#0d6efd" />
        </BarChart>
      </div>
    </div>
  );
}
