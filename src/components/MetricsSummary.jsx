import { useContext, useMemo } from "react";
import { AppContext } from "../context/AppContext";

const MetricsSummary = () => {
  const { rooms, bookings, todayString, dateRange, setDateRange } = useContext(AppContext);

  // Compute metrics based on currently loaded rooms and bookings
  const metrics = useMemo(() => {
    const totalRoomsCount = rooms.length;
    let occupiedTodayCount = 0;

    // Check occupancy for "today"
    const todayDate = new Date(todayString);
    rooms.forEach((room) => {
      const isOccupied = bookings.some((b) => {
        if (b.roomId !== room.id) return false;
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        // Occupied if: check-in <= today < check-out
        return start <= todayDate && todayDate < end;
      });
      if (isOccupied) {
        occupiedTodayCount++;
      }
    });

    const availableTodayCount = totalRoomsCount - occupiedTodayCount;

    // Compute revenue for the selected date range
    let expectedRevenue = 0;
    const rStart = new Date(dateRange.startDate);
    const rEnd = new Date(dateRange.endDate);

    // Make sure dateRange is valid (end is after start)
    if (rStart <= rEnd) {
      bookings.forEach((booking) => {
        const room = rooms.find((r) => r.id === booking.roomId);
        if (!room) return;

        const bStart = new Date(booking.startDate);
        const bEnd = new Date(booking.endDate);

        // Check if booking overlaps with range
        if (bStart < rEnd && rStart < bEnd) {
          const overlapStart = bStart < rStart ? rStart : bStart;
          const overlapEnd = bEnd < rEnd ? bEnd : rEnd;

          if (overlapStart < overlapEnd) {
            const diffTime = Math.abs(overlapEnd - overlapStart);
            const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            expectedRevenue += nights * room.pricePerNight;
          }
        }
      });
    }

    return {
      totalRooms: totalRoomsCount,
      availableToday: availableTodayCount,
      occupiedToday: occupiedTodayCount,
      revenue: expectedRevenue,
    };
  }, [rooms, bookings, todayString, dateRange]);

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setDateRange((prev) => ({ ...prev, startDate: val }));
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    setDateRange((prev) => ({ ...prev, endDate: val }));
  };

  return (
    <div className="metrics-summary">
      <div className="metrics-grid">
        {/* Card 1: Total Rooms */}
        <div className="metric-card">
          <div className="card-icon-wrapper total-rooms-icon">
            <svg viewBox="0 0 24 24" className="card-icon">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div className="card-info">
            <span className="card-label">Total Rooms</span>
            <span className="card-value">{metrics.totalRooms}</span>
          </div>
        </div>

        {/* Card 2: Available Today */}
        <div className="metric-card">
          <div className="card-icon-wrapper available-icon">
            <svg viewBox="0 0 24 24" className="card-icon">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div className="card-info">
            <span className="card-label">Available Today</span>
            <span className="card-value available-count">{metrics.availableToday}</span>
          </div>
        </div>

        {/* Card 3: Occupied Today */}
        <div className="metric-card">
          <div className="card-icon-wrapper occupied-icon">
            <svg viewBox="0 0 24 24" className="card-icon">
              <path d="M18 10.5V6c0-1.1-.9-2-2-2h-3V3c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H5c-1.1 0-2 .9-2 2v4.5c0 1.93 1.57 3.5 3.5 3.5L5 18v2h14v-2l-1.5-3c1.93 0 3.5-1.57 3.5-3.5zM12 4h1v1h-1V4zm-3 2h8v3h-8V6zm4 8H7.5C6.12 14 5 12.88 5 11.5S6.12 9 7.5 9h9c1.38 0 2.5 1.12 2.5 2.5S17.88 14 16.5 14H13z" />
            </svg>
          </div>
          <div className="card-info">
            <span className="card-label">Occupied Today</span>
            <span className="card-value occupied-count">{metrics.occupiedToday}</span>
          </div>
        </div>

        {/* Card 4: Expected Revenue */}
        <div className="metric-card revenue-card">
          <div className="card-icon-wrapper revenue-icon">
            <svg viewBox="0 0 24 24" className="card-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
            </svg>
          </div>
          <div className="card-info">
            <div className="revenue-header">
              <span className="card-label">Expected Revenue</span>
            </div>
            <span className="card-value revenue-value">
              ₹{metrics.revenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="revenue-range-selector">
        <span className="selector-title">Revenue Date Range:</span>
        <div className="range-inputs">
          <div className="input-group">
            <label>From</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={handleStartDateChange}
              className="date-input"
            />
          </div>
          <div className="input-group">
            <label>To</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={handleEndDateChange}
              className="date-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsSummary;
