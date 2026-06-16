import { addDays, format } from "date-fns";

export const generateMockBookings = (rooms) => {
  const bookings = [];
  const today = new Date();
  
  // Seed guest names and emails
  const guests = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Alice Johnson", email: "alice@example.com" },
    { name: "Bob Brown", email: "bob@example.com" },
    { name: "Charlie Davis", email: "charlie@example.com" },
    { name: "Diana Prince", email: "diana@example.com" },
    { name: "Evan Wright", email: "evan@example.com" },
    { name: "Fiona Gallagher", email: "fiona@example.com" },
    { name: "George Clark", email: "george@example.com" },
    { name: "Hannah Abbott", email: "hannah@example.com" }
  ];

  let bookingIdCounter = 1;

  // We want to book about 25% of the rooms to make the calendar look active but not crowded
  rooms.forEach((room, index) => {
    // Check if room should be booked (e.g. index divisible by 3)
    if (index % 3 === 0) {
      // Generate booking 1 (early in the month)
      // Start date between today and 5 days from now
      const startDaysOffset = (index % 5) + 1;
      const stayDuration = 2 + (index % 4); // 2 to 5 nights
      const startDateVal = addDays(today, startDaysOffset);
      const endDateVal = addDays(startDateVal, stayDuration);
      
      const guest = guests[index % guests.length];
      
      bookings.push({
        id: `b-${bookingIdCounter++}`,
        roomId: room.id,
        guestName: guest.name,
        guestEmail: guest.email,
        startDate: format(startDateVal, "yyyy-MM-dd"),
        endDate: format(endDateVal, "yyyy-MM-dd"),
        totalPrice: room.pricePerNight * stayDuration
      });

      // Generate booking 2 for some of these rooms (later in the month)
      if (index % 6 === 0) {
        const startDaysOffset2 = startDaysOffset + stayDuration + 3 + (index % 3);
        const stayDuration2 = 2 + (index % 3);
        const startDateVal2 = addDays(today, startDaysOffset2);
        const endDateVal2 = addDays(startDateVal2, stayDuration2);
        
        // Ensure within 30 days
        if (startDaysOffset2 + stayDuration2 < 30) {
          const guest2 = guests[(index + 3) % guests.length];
          bookings.push({
            id: `b-${bookingIdCounter++}`,
            roomId: room.id,
            guestName: guest2.name,
            guestEmail: guest2.email,
            startDate: format(startDateVal2, "yyyy-MM-dd"),
            endDate: format(endDateVal2, "yyyy-MM-dd"),
            totalPrice: room.pricePerNight * stayDuration2
          });
        }
      }
    }
  });

  return bookings;
};
