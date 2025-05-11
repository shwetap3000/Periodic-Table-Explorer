import React, { useState } from "react";
import elementsData from "../Data/elementsData";
import "./PeriodicTable.css";
import getBlockColor from "./blockColor";
import { getMainElements , getLanthanides , getActinides } from "./filterBlocks";
import SmallBox from "./SmallBox";

const PeriodicTable = () => {

  // Display Info on clicking the particular element
  const [selectedElement, setSelectedElement] = useState(null);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };


  // Filter Blocks

  const mainElements = getMainElements(elementsData);
  const lanthanides = getLanthanides(elementsData);
  const actinides = getActinides(elementsData);


  return (
    <div>

      <div className="box-container">
        <div style={{display: 'flex'}}><SmallBox color="skyblue" />s block</div>
        <div style={{display: 'flex'}}><SmallBox color="orange" />d block</div>
        <div style={{display: 'flex'}}><SmallBox color="green" />p block</div>
        <div style={{display: 'flex'}}><SmallBox color="purple" />f block</div>
      </div>

      {/* Main Periodic Table */}
      <div className="periodic-table">
        {mainElements.map((element) => (
          <div
            key={element.number}
            className="element"
            style={{
              gridColumn: element.group,
              gridRow: element.period,
              backgroundColor: getBlockColor(element.block),
            }}
            
        onClick = {() => handleElementClick(element)}
          >
            <strong className={`element-block ${element.block}`}>{element.symbol}</strong>
            <span className="atomic-number">{element.number}</span>
          </div>
        ))}
      </div>


      {/* Lanthanides Row */}
      <div className="f-block">
        {lanthanides.map((element, index) => (
          <div
            key={element.number}
            className="element"
            style={{
              gridColumn: index + 4,
              backgroundColor: getBlockColor(element.block),
            }}

        onClick = {() => handleElementClick(element)}
          >
            <strong className={`element-block ${element.block}`}>{element.symbol}</strong>
            <span className="atomic-number">{element.number}</span>
          </div>
        ))}
      </div>


      {/* Actinides Row (Below Lanthanides) */}
      <div className="f-block">
        {actinides.map((element, index) => (
          <div
            key={element.number}
            className="element"
            style={{
              gridColumn: index + 4,
              backgroundColor: getBlockColor(element.block),
            }}
           
        onClick = {() => handleElementClick(element)}
          >

            <strong className={`element-block ${element.block}`}>{element.symbol}</strong>
            <span className="atomic-number">{element.number}</span>
          </div>
        ))}
        </div>
  
        
        {/* Element Information */}
        <div className="periodic-table-container">

        {selectedElement && (
            <div className="element-details">
            <h2>{selectedElement.name}</h2>
            <p>Symbol:<b> {selectedElement.symbol}</b></p>
            <p>Atomic Number: <b>{selectedElement.number}</b></p>
            <p>Atomic Mass: <b>{selectedElement.atomic_mass}</b></p>
            <p>Group: <b>{selectedElement.group}</b></p>
            <p>Period: <b>{selectedElement.period}</b></p>
            <p>Block: <b>{selectedElement.block}</b></p>
            <p>Phase: <b>{selectedElement.phase}</b></p>
            <p>Discovered by: <b>{selectedElement.discovered_by}</b></p>
          </div>
        )}
        </div>
    </div>
  );
};

export default PeriodicTable;




// import React from 'react';
// import elementsData from '../Data/elementsData';
// import './PeriodicTable.css';

// const PeriodicTable = () => {
//   return (
//     <div className="periodic-table">
//       {elementsData.map((element) => (
//         <div
//           key={element.atomicNumber}
//           className="element"
//           style={{ gridColumn: element.group, gridRow: element.period }}
//         >
//           <strong>{element.symbol}</strong>
//           <span className="atomic-number">{element.atomicNumber}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PeriodicTable;

{
  /* F-block Elements Section
      <div className="f-block">
        {fBlockElements.map((element, index) => (
          <div
            key={element.number}
            className="element"
            style={{
              gridColumn: index + 4,  // F-block elements start at column 4
              gridRow: element.period === 6 ? 1 : 2 // Separate rows for Lanthanides & Actinides
            //   backgroundColor: element.color
            }}
          >
            <strong>{element.symbol}</strong>
            <span className="atomic-number">{element.number}</span>
          </div>
        ))}
      </div> */
}
