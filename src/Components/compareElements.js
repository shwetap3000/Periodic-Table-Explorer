import React, { useState } from "react";
import elementsData from "../Data/elementsData";
import "./compareElements.css";

// all the properties we want to show in the comparison table
const properties = [
  { label: "Atomic Number", key: "number" },
  { label: "Atomic Mass", key: "atomic_mass" },
  { label: "Group", key: "group" },
  { label: "Period", key: "period" },
  { label: "Block", key: "block" },
  { label: "Phase", key: "phase" },
  { label: "Electronegativity", key: "electronegativity_pauling" },
  { label: "Density (g/L)", key: "density" },
  { label: "Melting Point (K)", key: "melt" },
  { label: "Boiling Point (K)", key: "boil" },
  { label: "Discovered By", key: "discovered_by" },
  { label: "Category", key: "category" },
];

function CompareElements() {
  const [el1, setEl1] = useState("");
  const [el2, setEl2] = useState("");

  // find the full element object from the symbol the user picked
  const element1 = elementsData.find((e) => e.symbol === el1);
  const element2 = elementsData.find((e) => e.symbol === el2);

  // returns true if the two elements have different values for a given property
  // used to highlight rows where they differ
  const isDifferent = (key) => {
    if (!element1 || !element2) return false;
    return element1[key] !== element2[key];
  };

  return (
    <div className="compare-section">
      <h2 className="compare-title">⚗️ Compare Elements</h2>
      <p className="compare-subtitle">Select two elements to compare their properties side by side</p>

      {/* dropdowns to pick the two elements */}
      <div className="compare-selectors">
        <div className="selector-wrapper">
          <label>Element 1</label>
          <select onChange={(e) => setEl1(e.target.value)} value={el1}>
            <option value="">Select Element</option>
            {elementsData.map((el) => (
              <option key={el.symbol} value={el.symbol}>
                {el.name} ({el.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="vs-badge">VS</div>

        <div className="selector-wrapper">
          <label>Element 2</label>
          <select onChange={(e) => setEl2(e.target.value)} value={el2}>
            <option value="">Select Element</option>
            {elementsData.map((el) => (
              <option key={el.symbol} value={el.symbol}>
                {el.name} ({el.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* only show the comparison once both elements are selected */}
      {element1 && element2 && (
        <div className="compare-wrapper">

          {/* header showing the two element symbols with their block color */}
          <div className="compare-header">
            <div className="element-badge" style={{ background: `var(--color-${element1.block})` }}>
              <span className="element-symbol">{element1.symbol}</span>
              <span className="element-name">{element1.name}</span>
              <span className="element-number">#{element1.number}</span>
            </div>

            <div className="compare-icon">⚡</div>

            <div className="element-badge" style={{ background: `var(--color-${element2.block})` }}>
              <span className="element-symbol">{element2.symbol}</span>
              <span className="element-name">{element2.name}</span>
              <span className="element-number">#{element2.number}</span>
            </div>
          </div>

          {/* main comparison table — rows turn yellow when the values are different */}
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>{element1.name}</th>
                  <th>Property</th>
                  <th>{element2.name}</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(({ label, key }) => (
                  <tr key={key} className={isDifferent(key) ? "row-different" : "row-same"}>
                    <td className="value-cell">{element1[key] ?? "N/A"}</td>
                    <td className="property-label">{label}</td>
                    <td className="value-cell">{element2[key] ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="compare-hint">
            🟡 Highlighted rows indicate differences between the two elements
          </p>
        </div>
      )}

      {/* placeholder shown before the user picks both elements */}
      {(!element1 || !element2) && (
        <div className="compare-placeholder">
          <p>👆 Select two elements above to see their comparison</p>
        </div>
      )}
    </div>
  );
}

export default CompareElements;