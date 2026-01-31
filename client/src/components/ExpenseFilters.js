export default function ExpenseFilters({ setCategory, setMonth }) {
  return (
    <div className="row mb-3">
      <div className="col-md-4">
        <select className="form-select" onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Rent</option>
          <option>Others</option>
        </select>
      </div>

      <div className="col-md-4">
        <input
          type="month"
          className="form-control"
          onChange={e => setMonth(e.target.value)}
        />
      </div>
    </div>
  );
}
