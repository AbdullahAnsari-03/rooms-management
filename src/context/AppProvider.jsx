import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchRooms } from "../api/roomsApi";
import { generateMockBookings } from "../api/bookingsApi";
import { addDays, format } from "date-fns";
import { AppContext } from "./AppContext";

const LOCAL_STORAGE_KEY = "hotel_booking_filters";

export const AppProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [bookings, setBookings] = useState([]);

  // Base reference date for "today"
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Generate 30 columns of dates starting from today
  const calendarDates = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      return format(addDays(today, i), "yyyy-MM-dd");
    });
  }, [today]);

  // Initial Date Range for Revenue calculation (default: next 30 days)
  const [dateRange, setDateRange] = useState({
    startDate: format(today, "yyyy-MM-dd"),
    endDate: format(addDays(today, 29), "yyyy-MM-dd"),
  });

  // Load rooms and initial bookings
  useEffect(() => {
    const initializeData = async () => {
      try {
        const roomsData = await fetchRooms();
        setRooms(roomsData);

        // Load bookings from localStorage if present, else seed mock bookings
        const savedBookings = localStorage.getItem("hotel_bookings");
        if (savedBookings) {
          setBookings(JSON.parse(savedBookings));
        } else {
          const seeded = generateMockBookings(roomsData);
          setBookings(seeded);
          localStorage.setItem("hotel_bookings", JSON.stringify(seeded));
        }
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoadingRooms(false);
      }
    };
    initializeData();
  }, []);

  // Sync bookings state with localStorage when changed
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem("hotel_bookings", JSON.stringify(bookings));
    }
  }, [bookings]);

  // Initialize filters from localStorage or defaults
  const [filters, setFiltersState] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse filters from localStorage:", e);
      }
    }
    return {
      roomType: "All",
      minPrice: 0,
      maxPrice: 30000,
      availabilityDate: "",
    };
  });

  // Update filters and persist to localStorage
  const setFilters = useCallback((newFiltersOrFn) => {
    setFiltersState((prev) => {
      const next = typeof newFiltersOrFn === "function" ? newFiltersOrFn(prev) : newFiltersOrFn;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Check if a room is available for a date range
  const checkAvailability = useCallback((roomId, startDate, endDate, excludeBookingId = null) => {
    const reqStart = new Date(startDate);
    const reqEnd = new Date(endDate);

    if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime())) return false;
    if (reqStart >= reqEnd) return false;

    // Check overlaps
    return !bookings.some((booking) => {
      if (booking.roomId !== Number(roomId)) return false;
      if (excludeBookingId && booking.id === excludeBookingId) return false;

      const bStart = new Date(booking.startDate);
      const bEnd = new Date(booking.endDate);

      // Overlap condition: bStart < reqEnd && reqStart < bEnd
      return bStart < reqEnd && reqStart < bEnd;
    });
  }, [bookings]);

  // Add booking action
  const addBooking = useCallback((bookingData) => {
    const { roomId, guestName, guestEmail, startDate, endDate } = bookingData;
    
    // Validate availability
    const isAvail = checkAvailability(roomId, startDate, endDate);
    if (!isAvail) {
      return { success: false, error: "The room is already booked for these dates." };
    }

    const room = rooms.find((r) => r.id === Number(roomId));
    if (!room) {
      return { success: false, error: "Selected room not found." };
    }

    // Calculate nights
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = room.pricePerNight * nights;

    const newBooking = {
      id: `b-${Date.now()}`,
      roomId: Number(roomId),
      guestName,
      guestEmail,
      startDate,
      endDate,
      totalPrice,
    };

    setBookings((prev) => [...prev, newBooking]);
    return { success: true, booking: newBooking };
  }, [rooms, checkAvailability]);

  // Update booking action
  const updateBooking = useCallback((bookingId, updatedData) => {
    const { roomId, guestName, guestEmail, startDate, endDate } = updatedData;

    // Validate availability (excluding the current booking itself)
    const isAvail = checkAvailability(roomId, startDate, endDate, bookingId);
    if (!isAvail) {
      return { success: false, error: "The room is already booked for these dates." };
    }

    const room = rooms.find((r) => r.id === Number(roomId));
    if (!room) {
      return { success: false, error: "Selected room not found." };
    }

    // Calculate nights
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = room.pricePerNight * nights;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, roomId: Number(roomId), guestName, guestEmail, startDate, endDate, totalPrice }
          : b
      )
    );
    return { success: true };
  }, [rooms, checkAvailability]);

  // Cancel booking action
  const cancelBooking = useCallback((bookingId) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    return { success: true };
  }, []);

  // Memoized lists for speed and efficiency
  // Map bookings by room ID for O(1) lookup during cell rendering
  const bookingsByRoomId = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      if (!map[b.roomId]) {
        map[b.roomId] = [];
      }
      map[b.roomId].push(b);
    });
    return map;
  }, [bookings]);

  const value = {
    rooms,
    loadingRooms,
    bookings,
    bookingsByRoomId,
    calendarDates,
    todayString: format(today, "yyyy-MM-dd"),
    filters,
    setFilters,
    dateRange,
    setDateRange,
    checkAvailability,
    addBooking,
    updateBooking,
    cancelBooking,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
