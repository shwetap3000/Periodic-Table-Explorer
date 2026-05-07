import React, { useState, useCallback, useMemo, useRef } from "react";
import elementsData from "../Data/elementsData";
import "./PeriodicTable.css";
import getBlockColor from "./blockColor";
import { getMainElements, getLanthanides, getActinides } from "./filterBlocks";
import SmallBox from "./SmallBox";
import SearchBar from "./SearchBar";
import FilterPanel, { classifyElement } from "./FilterPanel";
import { useElement } from "../contexts/ElementContext";

const PeriodicTable = () => {
  const { selectedElement, setSelectedElement } = useElement();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    period: "all",
    group: "all",
    classify: classifyElement,
  });

  const [hoveredBlock, setHoveredBlock] = useState(null);

    // Tooltip state
  const [hoveredElement, setHoveredElement] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, placement: "top" });
  const hoverTimeoutRef = useRef(null);
  const elementRefs = useRef({});
  const tableRef = useRef(null);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSelectElement = useCallback((element) => {
    setSelectedElement(element);
    // Scroll the element into view with a highlight pulse
    const ref = elementRefs.current[element.number];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      ref.classList.add("element-pulse");
      setTimeout(() => ref.classList.remove("element-pulse"), 1200);
    }
  }, [setSelectedElement]);
    // Tooltip handlers
   const showTooltip = useCallback((element, event) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    const rect = event.currentTarget.getBoundingClientRect();
    const tableRect = tableRef.current?.getBoundingClientRect();

    if (!tableRect) return;

    const tooltipWidth = 240;
    const tooltipHeight = 120;
    const gap = 12;

    let x = rect.left + rect.width / 2 - tableRect.left;
    let y = rect.top - tableRect.top - gap;
    let placement = "top";

    if (rect.top - tableRect.top < tooltipHeight + 10) {
      y = rect.bottom - tableRect.top + gap;
      placement = "bottom";
    }

    x = Math.max(
      tooltipWidth / 2 + 8,
      Math.min(x, tableRect.width - tooltipWidth / 2 - 8)
    );

    setHoveredElement(element);
    setTooltipPosition({ x, y, placement });
    setTooltipVisible(true);
  }, []);

  const hideTooltip = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setTooltipVisible(false);
    setHoveredElement(null);
  }, []);

   const getElementGalleryUrl = useCallback((element) => {
    const query = encodeURIComponent(`${element.name} element`);
    return `https://commons.wikimedia.org/w/index.php?search=${query}&title=Special:MediaSearch&type=image`;
  }, []);

  // Determine if an element matches current search + filters
  const isElementVisible = useCallback(
    (element) => {
      // Hovered Block Filter
      if (hoveredBlock && element.block !== hoveredBlock) return false;

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          element.name.toLowerCase().includes(q) ||
          element.symbol.toLowerCase().includes(q) ||
          element.number.toString() === q;
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type !== "all") {
        const classification = filters.classify(element.category);
        if (classification !== filters.type) return false;
      }

      // Period filter
      if (filters.period !== "all") {
        if (element.period !== filters.period) return false;
      }

      // Group filter
      if (filters.group !== "all") {
        if (element.group !== filters.group) return false;
      }

      return true;
    },
    [searchQuery, filters, hoveredBlock]
  );

  // Filter data
  const mainElements = useMemo(() => getMainElements(elementsData), []);
  const lanthanides = useMemo(() => getLanthanides(elementsData), []);
  const actinides = useMemo(() => getActinides(elementsData), []);

  // Count visible
  const visibleCount = useMemo(() => {
    return elementsData.filter(isElementVisible).length;
  }, [isElementVisible]);

  const hasActiveFilters = searchQuery || filters.type !== "all" || filters.period !== "all" || filters.group !== "all";

  // Render element cell
  const renderElement = (element, gridStyle = {}) => {
    const visible = isElementVisible(element);
    const isSelected = selectedElement && selectedElement.number === element.number;

    return (
      <div
        key={element.number}
        ref={(el) => (elementRefs.current[element.number] = el)}
        className={`element ${!visible ? "element-hidden" : ""} ${isSelected ? "element-selected" : ""}`}
        style={{
          ...gridStyle,
          backgroundColor: visible ? getBlockColor(element.block) : undefined,
        }}
        onClick={() => {
          if (visible) handleElementClick(element);
        }}
        onMouseEnter={visible ? (e) => showTooltip(element, e) : undefined}
        onMouseLeave={hideTooltip}
        onFocus={visible ? (e) => showTooltip(element, e) : undefined}
        onBlur={hideTooltip}
        tabIndex={visible ? 0 : -1}
        title={visible ? `${element.name} (${element.symbol}) - #${element.number}` : ""}
      >
        {element.bohr_model_image && (
          <img
            src={element.bohr_model_image}
            alt=""
            className="element-bg-image"
            loading="lazy"
            aria-hidden="true"
          />
        )}
        <strong className={`element-block ${element.block}`}>
          {element.symbol}
        </strong>
        <span className="atomic-number">{element.number}</span>
      </div>
    );
  };

  return (
    <div className="periodic-table-wrapper">
      {/* Controls Bar */}
      <div className="controls-bar">
        <SearchBar
          elements={elementsData}
          onSearch={handleSearch}
          onSelectElement={handleSelectElement}
        />
        <FilterPanel onFilterChange={handleFilterChange} />

        {hasActiveFilters && (
          <div className="results-count">
            <span className="results-count-number">{visibleCount}</span>
            <span className="results-count-label">
              of {elementsData.length} elements
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="box-container">
        <div 
          className="legend-item"
          onMouseEnter={() => setHoveredBlock('s')}
          onMouseLeave={() => setHoveredBlock(null)}
          style={{ cursor: 'pointer' }}
        >
          <SmallBox color="skyblue" />
          <span>s block</span>
        </div>
        <div 
          className="legend-item"
          onMouseEnter={() => setHoveredBlock('d')}
          onMouseLeave={() => setHoveredBlock(null)}
          style={{ cursor: 'pointer' }}
        >
          <SmallBox color="orange" />
          <span>d block</span>
        </div>
        <div 
          className="legend-item"
          onMouseEnter={() => setHoveredBlock('p')}
          onMouseLeave={() => setHoveredBlock(null)}
          style={{ cursor: 'pointer' }}
        >
          <SmallBox color="#4ade80" />
          <span>p block</span>
        </div>
        <div 
          className="legend-item"
          onMouseEnter={() => setHoveredBlock('f')}
          onMouseLeave={() => setHoveredBlock(null)}
          style={{ cursor: 'pointer' }}
        >
          <SmallBox color="#a78bfa" />
          <span>f block</span>
        </div>
      </div>

      {/* Main Periodic Table */}
      <div className="periodic-table" ref={tableRef}>
        {mainElements.map((element) =>
          renderElement(element, {
            gridColumn: element.group,
            gridRow: element.period,
          })
        )}
                {/* ADVANCED HOVER TOOLTIP */}
        {hoveredElement && tooltipVisible && (
          <div
            className={`element-tooltip ${tooltipPosition.placement}`}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
            onMouseEnter={() => clearTimeout(hoverTimeoutRef.current)}
            onMouseLeave={hideTooltip}
            role="tooltip"
            aria-label={`${hoveredElement.name} details`}
          >
            <div className="tooltip-header">
              <div className="tooltip-symbol" style={{ backgroundColor: getBlockColor(hoveredElement.block) }}>
                {hoveredElement.symbol}
              </div>
              <div>
                <div className="tooltip-name">{hoveredElement.name}</div>
                <div className="tooltip-number">#{hoveredElement.number}</div>
              </div>
            </div>
            <div className="tooltip-details">
              <div className="tooltip-row">
                <span>Mass:</span>
                <span>{hoveredElement.atomic_mass ? parseFloat(hoveredElement.atomic_mass).toFixed(3) : "—"}</span>
              </div>
              {hoveredElement.category && (
                <div className="tooltip-row">
                  <span>Type:</span>
                  <span>{hoveredElement.category}</span>
                </div>
              )}
              <div className="tooltip-row">
                <span>Block:</span>
                <span>{hoveredElement.block}</span>
              </div>
            </div>
            <div className={`tooltip-arrow ${tooltipPosition.placement}`}></div>
          </div>
        )}
      </div>

      {/* Lanthanides Row */}
      <div className="f-block">
        {lanthanides.map((element, index) =>
          renderElement(element, {
            gridColumn: index + 4,
          })
        )}
      </div>

      {/* Actinides Row */}
      <div className="f-block">
        {actinides.map((element, index) =>
          renderElement(element, {
            gridColumn: index + 4,
          })
        )}
      </div>

      {/* Element Information Panel */}
      {selectedElement && (
        <div className="element-details-overlay" onClick={() => setSelectedElement(null)}>
          <div
            className="element-details"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="details-close-btn"
              onClick={() => setSelectedElement(null)}
              aria-label="Close details"
              id="details-close-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <div className="details-header">
              <div
                className="details-symbol-badge"
                style={{ background: getBlockColor(selectedElement.block) }}
              >
                {selectedElement.symbol}
              </div>
              <div className="details-title">
                <h2>{selectedElement.name}</h2>
                <span className="details-category">{selectedElement.category}</span>
              </div>
            </div>

            {selectedElement.bohr_model_3d && (
              <div className="model-viewer-container">
                <model-viewer
                  src={selectedElement.bohr_model_3d}
                  alt={`3D Bohr model of ${selectedElement.name}`}
                  auto-rotate
                  camera-controls
                  ar
                  style={{ width: '100%', height: '250px', outline: 'none' }}
                ></model-viewer>
                <div className="model-viewer-hint">Drag to rotate • Scroll to zoom • AR enabled</div>
              </div>
            )}

            {/* Element Image */}
            {selectedElement.image?.url ? (
              <div className="details-image-wrapper">
                <img
                  src={selectedElement.image.url}
                  alt={selectedElement.image.title || selectedElement.name}
                  className="details-element-image"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                {selectedElement.image.title && (
                  <p className="details-image-caption">{selectedElement.image.title}</p>
                )}
              </div>
            ) : (
              <div className="details-image-placeholder">
                <span className="details-image-placeholder-symbol">{selectedElement.symbol}</span>
                <span className="details-image-placeholder-text">No image available</span>
              </div>
            )}

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Atomic Number</span>
                <span className="detail-value">{selectedElement.number}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Atomic Mass</span>
                <span className="detail-value">
                  {selectedElement.atomic_mass != null
                    ? parseFloat(selectedElement.atomic_mass).toFixed(4)
                    : "—"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Group</span>
                <span className="detail-value">{selectedElement.group ?? "—"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Period</span>
                <span className="detail-value">{selectedElement.period}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Block</span>
                <span className="detail-value">{selectedElement.block}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phase</span>
                <span className="detail-value">{selectedElement.phase ?? "—"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Melting Point</span>
                <span className="detail-value">
                  {selectedElement.melt != null ? `${selectedElement.melt} K` : "—"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Boiling Point</span>
                <span className="detail-value">
                  {selectedElement.boil != null ? `${selectedElement.boil} K` : "—"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Electron Affinity</span>
                <span className="detail-value">
                  {selectedElement.electron_affinity != null
                    ? `${selectedElement.electron_affinity} kJ/mol`
                    : "—"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Named By</span>
                <span className="detail-value">{selectedElement.named_by ?? "—"}</span>
              </div>
              <div className="detail-item detail-item-full">
                <span className="detail-label">Appearance</span>
                <span className="detail-value">{selectedElement.appearance ?? "—"}</span>
              </div>
              <div className="detail-item detail-item-full">
                <span className="detail-label">Discovered by</span>
                <span className="detail-value">{selectedElement.discovered_by ?? "Unknown"}</span>
              </div>
              {selectedElement.electron_configuration_semantic && (
                <div className="detail-item detail-item-full">
                  <span className="detail-label">Electron Configuration</span>
                  <span className="detail-value detail-value-mono">
                    {selectedElement.electron_configuration_semantic}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="details-actions">
              <a
                className="details-gallery-btn"
                href={getElementGalleryUrl(selectedElement)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Gallery
              </a>
              {selectedElement.source && (
                <a
                  className="details-wiki-btn"
                  href={selectedElement.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more on Wikipedia →
                </a>
              )}
            </div>

            {/* Spectral image */}
            {selectedElement.spectral_img && (
              <div className="details-spectral">
                <span className="detail-label">Spectral Image</span>
                <a
                  href={selectedElement.spectral_img}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="details-spectral-link"
                >
                  View spectral lines →
                </a>
              </div>
            )}

            {selectedElement.summary && (
              <p className="details-summary">{selectedElement.summary}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable;
