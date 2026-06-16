import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { format, parseISO } from "date-fns";
import useRooms from "../hooks/useRooms";

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const { rooms } = useRooms();
  const { bookingsByRoomId } = useContext(AppContext);
  const navigate = useNavigate();

  const room = useMemo(() => {
    return rooms.find((r) => r.id === Number(roomId));
  }, [rooms, roomId]);

  const roomBookings = useMemo(() => {
    if (!room) return [];
    // Sort bookings by start date
    return (bookingsByRoomId[room.id] || []).slice().sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    });
  }, [bookingsByRoomId, room]);

  if (!room) {
    return (
      <div className="page error-page">
        <div className="error-card">
          <h2>Room Not Found</h2>
          <p>The room with ID "{roomId}" could not be located in our inventory.</p>
          <Link to="/rooms" className="back-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page room-details-page">
      <div className="details-navigation">
        <button onClick={() => navigate("/rooms")} className="back-link-btn">
          <svg viewBox="0 0 24 24" className="nav-icon-back">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="room-profile-grid">
        {/* Left Side: Room Profile Card */}
        <div className="room-profile-card">
          <div className={`room-banner banner-${room.type.toLowerCase().replace(" ", "-")}`}>
            <span className="banner-type-badge">{room.type}</span>
          </div>

          <div className="profile-content">
            <h1 className="profile-room-name">{room.name}</h1>
            
            <div className="profile-price-row">
              <span className="profile-price">₹{room.pricePerNight.toLocaleString()}</span>
              <span className="profile-price-label">/ night</span>
            </div>

            <p className="profile-description">{room.description}</p>

            <div className="amenities-section">
              <h3 className="section-label">Room Amenities</h3>
              <div className="amenities-badges">
                {room.amenities.map((amenity, idx) => (
                  <span key={idx} className="amenity-pill">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to={`/booking/new?roomId=${room.id}`}
              className="book-now-button"
            >
              <svg viewBox="0 0 24 24" className="btn-icon-calendar">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              Book Room
            </Link>
          </div>
        </div>

        {/* Right Side: Room Booking Schedule */}
        <div className="room-bookings-panel">
          <h2 className="panel-title">Active Booking Schedule</h2>
          
          {roomBookings.length === 0 ? (
            <div className="empty-schedule-card">
              <svg viewBox="0 0 24 24" className="empty-schedule-icon">
                <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H8v-2h6v2zm3-4H8v-2h9v2z" />
              </svg>
              <p className="empty-schedule-text">
                No current or upcoming bookings are scheduled for this room.
              </p>
            </div>
          ) : (
            <div className="booking-list-table-wrapper">
              <table className="booking-list-table">
                <thead>
                  <tr>
                    <th>Guest Details</th>
                    <th>Date Range</th>
                    <th>Nights</th>
                    <th>Total Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roomBookings.map((booking) => {
                    const diffTime = Math.abs(new Date(booking.endDate) - new Date(booking.startDate));
                    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={booking.id}>
                        <td>
                          <div className="table-guest-name">{booking.guestName}</div>
                          <div className="table-guest-email">{booking.guestEmail}</div>
                        </td>
                        <td>
                          <div className="table-date-range">
                            {format(parseISO(booking.startDate), "MMM dd")} - {format(parseISO(booking.endDate), "MMM dd, yyyy")}
                          </div>
                        </td>
                        <td>{nights}</td>
                        <td className="table-price">₹{booking.totalPrice.toLocaleString()}</td>
                        <td>
                          <Link to={`/booking/${booking.id}`} className="table-edit-btn">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
