import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import Tesseract from 'tesseract.js';
import { extractFieldsFromText } from "../../utils/ocrParser";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const [isScanning, setIsScanning] = useState(false);

  const handleChange = (key, value) =>
    setExpense((prev) => ({ ...prev, [key]: value }));

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });
      console.log("OCR Text:", text);

      const { amount, date, source } = extractFieldsFromText(text);

      if (amount) handleChange("amount", amount);
      if (date) handleChange("date", date);
      if (source) handleChange("category", source);
    } catch (error) {
      console.error("OCR Error:", error);
    }

    setIsScanning(false);
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <div className="my-4">
        <label className="block mb-2 font-semibold">
          Upload Receipt (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleReceiptUpload}
          className="border p-2 w-full"
        />
        {isScanning && (
          <p className="text-blue-500 mt-2">Scanning receipt...</p>
        )}
      </div>

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Expense Source"
        placeholder="Groceries, Rent, Travel, etc"
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder="mm/dd/yyyy"
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddExpense(expense)}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;

