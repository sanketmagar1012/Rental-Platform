import React from 'react';

const CheckboxGroup = ({ label, options, selected, onChange, columns = 2 }) => {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const colClass =
    columns === 3 ? 'sm:grid-cols-3' : columns === 1 ? 'grid-cols-1' : 'sm:grid-cols-2';

  return (
    <fieldset>
      {label && (
        <legend className="block text-sm font-medium text-gray-700 mb-2">{label}</legend>
      )}
      <div className={`grid grid-cols-1 ${colClass} gap-2`}>
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="rounded border-gray-300 text-mb-red focus:ring-mb-red"
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default CheckboxGroup;
