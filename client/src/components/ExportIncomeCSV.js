import Papa from "papaparse";
import { saveAs } from "file-saver";

export default function ExportIncomeCSV({ income }) {
  const exportFile = () => {
    if (!income || income.length === 0) {
      alert("No income data to export");
      return;
    }

    const formattedIncome = income.map(i => ({
      Title: i.title,
      Amount: i.amount,
      Source: i.source,
      Date: new Date(i.date).toLocaleDateString(),
      Notes: i.notes || ""
    }));

    const csv = Papa.unparse(formattedIncome);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "income.csv");
  };

  return (
    <button className="btn btn-outline-primary mb-3" onClick={exportFile}>
      Export Income CSV
    </button>
  );
}
