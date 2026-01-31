export default function IncomeFilters({ setSource, setMonth }) {
  return (
    <div className="row mb-3">
      <div className="col-md-4">
        <select
          className="form-select"
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">All Sources</option>
          <option>Salary</option>
          <option>Freelance</option>
          <option>Business</option>
          <option>Investments</option>
          <option>Rental</option>
          <option>Other</option>
        </select>
      </div>

      <div className="col-md-4">
        <input
          type="month"
          className="form-control"
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>
    </div>
  );
}
