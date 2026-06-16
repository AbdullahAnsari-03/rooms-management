import MetricsSummary from "../components/MetricsSummary";
import Filters from "../components/Filters";
import CalendarGrid from "../components/CalendarGrid";

const RoomListingPage = () => {
  return (
    <div className="page room-listing-page">
      <div className="page-header-section">
        <h1 className="page-title">Room Booking Calendar</h1>
        <p className="page-subtitle">
          Manage your hotel inventory, monitor occupancy rates, and handle bookings in real-time.
        </p>
      </div>

      <MetricsSummary />
      <Filters />
      
      <div className="calendar-section-wrapper">
        <div className="section-header">
          <h2 className="section-title">Availability Grid</h2>
          <div className="guide-legend">
            <span className="legend-item"><span className="legend-dot color-avail"></span> Available</span>
            <span className="legend-item"><span className="legend-dot color-booked"></span> Booked</span>
          </div>
        </div>
        <CalendarGrid />
      </div>
    </div>
  );
};

export default RoomListingPage;
