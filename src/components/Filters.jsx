import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Filters = () => {
  const { filters, setFilters } = useContext(AppContext);

  const handleTypeChange = (e) => {
    setFilters((prev) => ({ ...prev, roomType: e.target.value }));
  };

  const handleMinPriceChange = (e) => {
    const val = Number(e.target.value) || 0;
    setFilters((prev) => ({ ...prev, minPrice: val }));
  };

  const handleMaxPriceChange = (e) => {
    const val = Number(e.target.value) || 0;
    setFilters((prev) => ({ ...prev, maxPrice: val }));
  };

  const handleMaxPriceSlider = (e) => {
    const val = Number(e.target.value) || 0;
    setFilters((prev) => ({ ...prev, maxPrice: val }));
  };

  const handleDateChange = (e) => {
    setFilters((prev) => ({ ...prev, availabilityDate: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({
      roomType: "All",
      minPrice: 0,
      maxPrice: 30000,
      availabilityDate: "",
    });
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3 className="filters-title">
          <svg viewBox="0 0 24 24" className="filters-header-icon">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
          </svg>
          Filter Rooms
        </h3>
        <button onClick={resetFilters} className="reset-button" type="button">
          Reset Filters
        </button>
      </div>

      <div className="filters-grid">
        {/* Room Type */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-type">Room Type</label>
          <select
            id="filter-type"
            value={filters.roomType}
            onChange={handleTypeChange}
            className="filter-input select-input"
          >
            <option value="All">All Types</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Presidential Suite">Presidential Suite</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group price-filter-group">
          <label className="filter-label">Price Range (₹/night)</label>
          <div className="price-inputs">
            <input
              type="number"
              min="0"
              max="50000"
              value={filters.minPrice}
              onChange={handleMinPriceChange}
              className="filter-input number-input"
              placeholder="Min"
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              min="0"
              max="50000"
              value={filters.maxPrice}
              onChange={handleMaxPriceChange}
              className="filter-input number-input"
              placeholder="Max"
            />
          </div>
          <div className="price-slider-container">
            <input
              type="range"
              min="1000"
              max="35000"
              step="500"
              value={filters.maxPrice}
              onChange={handleMaxPriceSlider}
              className="price-slider"
            />
            <div className="slider-labels">
              <span>₹1,000</span>
              <span className="current-max-label">Max Limit: ₹{filters.maxPrice.toLocaleString()}</span>
              <span>₹35,000</span>
            </div>
          </div>
        </div>

        {/* Date Availability */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-date">Available on Date</label>
          <input
            id="filter-date"
            type="date"
            value={filters.availabilityDate}
            onChange={handleDateChange}
            className="filter-input date-input"
          />
          <span className="input-helper">Find rooms with no bookings on this day</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
