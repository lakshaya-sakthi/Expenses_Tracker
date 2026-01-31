import Papa from "papaparse";
import { saveAs } from "file-saver";

export default function ExportCSV({ expenses }) {
  const exportFile = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expenses.csv");
  };

  return (
    <button className="btn btn-outline-success mb-3" onClick={exportFile}>
      Export CSV
    </button>
  );
}
