import React from "react";

const StyledSelect = ({ value, onChange, options, currentTheme, label }) => {
  const selectStyles = {
    container: {
      position: "relative",
      width: "100%",
    },
    select: {
      width: "100%",
      padding: "0.75rem 1rem",
      backgroundColor: currentTheme.surfaceMedium,
      border: `1px solid ${currentTheme.borderLight}`,
      borderRadius: "0.375rem",
      color: currentTheme.textPrimary,
      appearance: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    option: {
      backgroundColor: currentTheme.optionBg,
      color: currentTheme.optionText,
      padding: "0.5rem 1rem",
    },
  };

  return (
    <div style={selectStyles.container}>
      {label && (
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: currentTheme.textPrimary }}
        >
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        style={selectStyles.select}
        className="focus:outline-none focus:ring-2 focus:ring-opacity-50"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={selectStyles.option}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StyledSelect;
