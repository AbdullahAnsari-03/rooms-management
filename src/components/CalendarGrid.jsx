import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { List } from "react-window";
import { AppContext } from "../context/AppContext";
import { format, addDays, parseISO } from "date-fns";
import useRooms from "../hooks/useRooms";

// Stable row rendering component outside main CalendarGrid to avoid remounting during parent updates
const RowComponent = ({
  index,
  style,
  filteredRooms,
  bookingsByRoomId,
  calendarDates,
  ROOM_COL_WIDTH,
  DATE_COL_WIDTH,
  navigate,
  todayString,
}) => {
  const room = filteredRooms[index];
  if (!room) return null;

  const roomBookings = bookingsByRoomId[room.id] || [];
  const totalWidth = ROOM_COL_WIDTH + calendarDates.length * DATE_COL_WIDTH;

  return (
    <div className="grid-row" style={{ ...style, display: "flex", width: totalWidth }}>
      {/* Left Side: Room Info */}
      <div
        className="room-info-cell"
        style={{ width: ROOM_COL_WIDTH, flexShrink: 0 }}
        onClick={() => navigate(`/rooms/${room.id}`)}
        title="Click to view Room Details"
      >
        <div className="room-meta">
          <span className="room-name">{room.name}</span>
          <span className={`room-type-badge type-${room.type.toLowerCase().replace(" ", "-")}`}>
            {room.type}
          </span>
        </div>
        <div className="room-price-info">
          <span className="room-price-val">₹{room.pricePerNight.toLocaleString()}</span>
          <span className="room-price-unit">/ night</span>
        </div>
      </div>

      {/* Right Side: 30 Date Cells */}
      {calendarDates.map((dateStr) => {
        // Find if this cell's date is booked
        const booking = roomBookings.find((b) => {
          return b.startDate <= dateStr && dateStr < b.endDate;
        });

        if (booking) {
          // Booked cell layout logic
          const isStart = dateStr === booking.startDate;
          
          // Calculate if the next day is checkout
          const nextDayStr = format(addDays(parseISO(dateStr), 1), "yyyy-MM-dd");
          const isEnd = nextDayStr === booking.endDate;

          // Define styling classes
          let bookingClass = "cell-booked";
          if (isStart && isEnd) bookingClass += " booking-single";
          else if (isStart) bookingClass += " booking-start";
          else if (isEnd) bookingClass += " booking-end";
          else bookingClass += " booking-middle";

          // Determine background color variation based on guest name
          const colorIndex = (booking.guestName.charCodeAt(0) + booking.roomId) % 4;
          bookingClass += ` booking-color-${colorIndex}`;

          return (
            <div
              key={dateStr}
              className={`grid-cell booked-cell-wrapper${dateStr === todayString ? " today-column" : ""}`}
              style={{ width: DATE_COL_WIDTH, flexShrink: 0 }}
              onClick={() => navigate(`/booking/${booking.id}`)}
              title={`Booked by ${booking.guestName} (${booking.startDate} to ${booking.endDate})`}
            >
              <div className={`booking-capsule ${bookingClass}`}>
                {isStart && <span className="booking-guest-name">{booking.guestName}</span>}
              </div>
            </div>
          );
        } else {
          // Available cell
          return (
            <div
              key={dateStr}
              className={`grid-cell cell-available${dateStr === todayString ? " today-column" : ""}`}
              style={{ width: DATE_COL_WIDTH, flexShrink: 0 }}
              onClick={() => navigate(`/booking/new?roomId=${room.id}&startDate=${dateStr}`)}
              title="Click to book this slot"
            >
              <div className="available-indicator">
                <svg viewBox="0 0 24 24" className="plus-icon">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

const CalendarGrid = () => {
  const { rooms } = useRooms();
  const {
    bookingsByRoomId,
    calendarDates,
    filters,
    todayString,
  } = useContext(AppContext);
  
  const navigate = useNavigate();

  // Filter rooms based on current criteria
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Room Type Filter
      if (filters.roomType !== "All" && room.type !== filters.roomType) {
        return false;
      }

      // 2. Price Range Filter
      if (room.pricePerNight < filters.minPrice || room.pricePerNight > filters.maxPrice) {
        return false;
      }

      // 3. Availability Date Filter
      if (filters.availabilityDate) {
        const targetDate = new Date(filters.availabilityDate);
        const roomBookings = bookingsByRoomId[room.id] || [];
        const isOccupied = roomBookings.some((b) => {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          return start <= targetDate && targetDate < end;
        });
        if (isOccupied) return false;
      }

      return true;
    });
  }, [rooms, filters, bookingsByRoomId]);

  // Dimension Constants
  const ROOM_COL_WIDTH = 260;
  const DATE_COL_WIDTH = 80;
  const ROW_HEIGHT = 68;
  const HEADER_HEIGHT = 80;

  const totalWidth = ROOM_COL_WIDTH + calendarDates.length * DATE_COL_WIDTH;

  // Format headers for readability
  const formattedHeaders = useMemo(() => {
    return calendarDates.map((dateStr) => {
      const date = parseISO(dateStr);
      return {
        fullStr: dateStr,
        dayNum: format(date, "d"),
        dayName: format(date, "eee"),
        monthName: format(date, "MMM"),
      };
    });
  }, [calendarDates]);

  // Memoize properties passed down to the Row renderer
  const rowProps = useMemo(() => {
    return {
      filteredRooms,
      bookingsByRoomId,
      calendarDates,
      ROOM_COL_WIDTH,
      DATE_COL_WIDTH,
      navigate,
      todayString,
    };
  }, [filteredRooms, bookingsByRoomId, calendarDates, navigate, todayString]);

  return (
    <div className="calendar-grid-wrapper">
      {filteredRooms.length === 0 ? (
        <div className="no-rooms-card">
          <svg viewBox="0 0 24 24" className="no-rooms-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <h4 className="no-rooms-title">No Rooms Found</h4>
          <p className="no-rooms-desc">
            No rooms match your filter criteria. Try adjusting the room type, expanding the price range, or clearing the availability date.
          </p>
        </div>
      ) : (
        <div className="horizontal-scroll-container">
          <div style={{ width: totalWidth }} className="calendar-content">
            {/* Header Row */}
            <div className="grid-header-row" style={{ height: HEADER_HEIGHT, display: "flex", width: totalWidth }}>
              <div className="room-header-cell" style={{ width: ROOM_COL_WIDTH, flexShrink: 0 }}>
                <span className="header-title">Room & Details</span>
                <span className="header-subtitle">{filteredRooms.length} rooms listed</span>
              </div>
              
              {formattedHeaders.map((header) => {
                const isToday = header.fullStr === todayString;
                return (
                  <div
                    key={header.fullStr}
                    className={`date-header-cell${isToday ? " today-header-cell today-column" : ""}`}
                    style={{ width: DATE_COL_WIDTH, flexShrink: 0 }}
                  >
                    <span className="header-month">{header.monthName}</span>
                    <span className="header-day-num">{header.dayNum}</span>
                    <span className="header-day-name">{header.dayName}</span>
                    {isToday && <span className="today-badge-label">Today</span>}
                  </div>
                );
              })}
            </div>

            {/* Virtualized Rows List */}
            <List
              height={580}
              rowCount={filteredRooms.length}
              rowHeight={ROW_HEIGHT}
              width={totalWidth}
              rowComponent={RowComponent}
              rowProps={rowProps}
              className="virtualized-list-body"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
