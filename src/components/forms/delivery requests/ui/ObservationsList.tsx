import { useEffect, useState } from "react";
import { deliveryData } from "src/stores/deliveryStepper";

export default function ObservationsList() {
  const [items, setItems] = useState<string[]>(() => deliveryData.get().observations || []);
  const [text, setText] = useState("");

  useEffect(() => {
    deliveryData.setKey("observations", items);
  }, [items]);

  const addItem = () => {
    const t = text.trim();
    if (!t) return;
    setItems((prev) => [...prev, t]);
    setText("");
  };

  const removeItem = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-2">
      <p className="text-base">Notas (opcional)</p>
      <div className="flex gap-2">
        <input
          type="text"
          className="border border-gray-300 rounded-md px-3 py-2 flex-1"
          placeholder="Añade una observación y presiona Enter"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <button
          type="button"
          disabled={!text.trim()}
          className="bg-H-blue-700 text-white rounded-md px-4 py-2 cursor-pointer hover:bg-H-blue-900 transition-colors"
          onClick={addItem}
        >
          Añadir
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((it, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 flex items-center gap-2 select-none"
            >
              {it}
              <button
                type="button"
                className="text-red-600 hover:text-red-800 cursor-pointer"
                onClick={() => removeItem(idx)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}