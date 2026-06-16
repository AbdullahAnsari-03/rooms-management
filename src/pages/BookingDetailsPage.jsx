import { useState, useContext, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { format, addDays, parseISO } from "date-fns";

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    rooms,
    bookings,
    addBooking,
    updateBooking,
    cancelBooking,
    checkAvailability,
    todayString,
  } = useContext(AppContext);

  // Check if we are creating a new booking
  const isNew = bookingId === "new";

  // Parse query parameters for new bookings
  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);

  // Find existing booking if editing
  const existingBooking = useMemo(() => {
    if (isNew) return null;
    return bookings.find((b) => b.id === bookingId);
  }, [bookings, bookingId, isNew]);

  // Form State: Initialize directly on mount using lazy initializers
  const [roomId, setRoomId] = useState(() => {
    if (isNew) {
      return queryParams.get("roomId") || "";
    }
    return existingBooking ? existingBooking.roomId.toString() : "";
  });

  const [startDate, setStartDate] = useState(() => {
    if (isNew) {
      return queryParams.get("startDate") || todayString;
    }
    return existingBooking ? existingBooking.startDate : todayString;
  });

  const [endDate, setEndDate] = useState(() => {
    if (isNew) {
      const start = queryParams.get("startDate") || todayString;
      try {
        return format(addDays(parseISO(start), 2), "yyyy-MM-dd");
      } catch {
        return todayString;
      }
    }
    return existingBooking ? existingBooking.endDate : "";
  });

  const [guestName, setGuestName] = useState(() => {
    return existingBooking ? existingBooking.guestName : "";
  });

  const [guestEmail, setGuestEmail] = useState(() => {
    return existingBooking ? existingBooking.guestEmail : "";
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Selected Room details
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === Number(roomId));
  }, [rooms, roomId]);

  // Calculated stay metrics
  const stayMetrics = useMemo(() => {
    if (!startDate || !endDate || !selectedRoom) {
      return { nights: 0, totalPrice: 0 };
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return { nights: 0, totalPrice: 0 };
    }
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = nights * selectedRoom.pricePerNight;
    return { nights, totalPrice };
  }, [startDate, endDate, selectedRoom]);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Basic Validation
    if (!roomId) {
      setErrorMsg("Please select a room.");
      return;
    }
    if (!guestName.trim()) {
      setErrorMsg("Please enter the guest name.");
      return;
    }
    if (!guestEmail.trim()) {
      setErrorMsg("Please enter the guest email.");
      return;
    }
    // Simple Email Regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!startDate || !endDate) {
      setErrorMsg("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setErrorMsg("Check-out date must be after check-in date.");
      return;
    }

    // Overlap validation
    // If editing, we exclude the current booking ID
    const isAvailable = checkAvailability(
      roomId,
      startDate,
      endDate,
      isNew ? null : bookingId
    );

    if (!isAvailable) {
      setErrorMsg(
        "Double Booking Alert: The selected room is already reserved during this date range. Please select different dates or a different room."
      );
      return;
    }

    // Save Action
    const payload = {
      roomId: Number(roomId),
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      startDate,
      endDate,
    };

    if (isNew) {
      const result = addBooking(payload);
      if (result.success) {
        setSuccessMsg("Booking created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/rooms");
        }, 1500);
      } else {
        setErrorMsg(result.error || "Failed to create booking.");
      }
    } else {
      const result = updateBooking(bookingId, payload);
      if (result.success) {
        setSuccessMsg("Booking updated successfully! Redirecting...");
        setTimeout(() => {
          navigate("/rooms");
        }, 1500);
      } else {
        setErrorMsg(result.error || "Failed to update booking.");
      }
    }
  };

  // Cancel Handler
  const handleCancelBooking = () => {
    if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      cancelBooking(bookingId);
      navigate("/rooms");
    }
  };

  if (!isNew && !existingBooking) {
    return (
      <div className="page error-page">
        <div className="error-card">
          <h2>Booking Not Found</h2>
          <p>The reservation with ID "{bookingId}" could not be located.</p>
          <button onClick={() => navigate("/rooms")} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page booking-details-page">
      <div className="details-navigation">
        <button onClick={() => navigate("/rooms")} className="back-link-btn">
          <svg viewBox="0 0 24 24" className="nav-icon-back">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Cancel and Return
        </button>
      </div>

      <div className="booking-editor-container">
        <div className="booking-form-card">
          <h2 className="form-card-title">
            {isNew ? "Create New Booking" : "Edit Reservation Details"}
          </h2>
          
          {errorMsg && (
            <div className="message-alert alert-error">
              <svg viewBox="0 0 24 24" className="alert-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="message-alert alert-success">
              <svg viewBox="0 0 24 24" className="alert-icon">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            {/* Room Selection */}
            <div className="form-group">
              <label className="form-label">Select Room</label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="form-input select-input"
              >
                <option value="" disabled>-- Select a Room --</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} - {r.type} (₹{r.pricePerNight.toLocaleString()}/night)
                  </option>
                ))}
              </select>
            </div>

            {/* Guest Name */}
            <div className="form-group">
              <label className="form-label">Guest Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="form-input text-input"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            {/* Guest Email */}
            <div className="form-group">
              <label className="form-label">Guest Email</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="form-input text-input"
                placeholder="e.g. john@example.com"
                required
              />
            </div>

            {/* Dates Row */}
            <div className="form-dates-row">
              <div className="form-group date-input-group">
                <label className="form-label">Check-in Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input date-input"
                  required
                />
              </div>

              <div className="form-group date-input-group">
                <label className="form-label">Check-out Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input date-input"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions-wrapper">
              <button type="submit" className="submit-booking-btn">
                {isNew ? "Confirm Reservation" : "Save Changes"}
              </button>
              
              {!isNew && (
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="cancel-booking-btn"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Pricing Summary Panel */}
        {selectedRoom && (
          <div className="pricing-summary-card">
            <h3 className="summary-title">Reservation Summary</h3>
            <div className="summary-room-info">
              <span className="summary-room-name">{selectedRoom.name}</span>
              <span className="summary-room-type">{selectedRoom.type}</span>
            </div>
            
            <hr className="summary-divider" />
            
            <div className="summary-details">
              <div className="detail-item">
                <span className="detail-label">Rate per Night</span>
                <span className="detail-value">₹{selectedRoom.pricePerNight.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Stay</span>
                <span className="detail-value">
                  {stayMetrics.nights} {stayMetrics.nights === 1 ? "night" : "nights"}
                </span>
              </div>
            </div>

            <hr className="summary-divider" />

            <div className="summary-total-row">
              <span className="total-label">Total Cost</span>
              <span className="total-value">₹{stayMetrics.totalPrice.toLocaleString()}</span>
            </div>

            <div className="summary-policies">
              <h4>Booking Policies</h4>
              <ul>
                <li>Check-in is at 3:00 PM.</li>
                <li>Check-out is at 11:00 AM.</li>
                <li>Flexible cancellation up to 24 hours prior.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsPage;
