export const fetchRooms = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const types = ["Standard", "Deluxe", "Suite", "Presidential Suite"];
      const basePrices = {
        Standard: 2500,
        Deluxe: 5000,
        Suite: 10000,
        "Presidential Suite": 25000,
      };
      
      const rooms = [];
      const amenitiesList = [
        "Free Wi-Fi", 
        "Air Conditioning", 
        "Smart TV", 
        "Mini Bar", 
        "Room Service", 
        "Ocean View", 
        "Jacuzzi", 
        "Espresso Machine"
      ];

      for (let i = 1; i <= 520; i++) {
        // Distribute room types
        let type = types[0]; // Standard
        if (i % 25 === 0) {
          type = types[3]; // Presidential Suite (4%)
        } else if (i % 8 === 0) {
          type = types[2]; // Suite (12.5%)
        } else if (i % 3 === 0) {
          type = types[1]; // Deluxe (approx 33%)
        }
        
        // Vary price slightly based on room index to make it look realistic
        const priceModifier = (i % 8) * 250;
        const pricePerNight = basePrices[type] + priceModifier;
        
        // Floor calculation
        const floor = Math.floor(i / 100) + 1;
        const roomNum = floor * 100 + (i % 100 || 100);
        
        // Vary amenities based on room type
        let amenities;
        if (type === "Standard") {
          amenities = amenitiesList.slice(0, 3); // Wi-Fi, AC, TV
        } else if (type === "Deluxe") {
          amenities = amenitiesList.slice(0, 5); // Add Mini Bar, Room Service
        } else if (type === "Suite") {
          amenities = [...amenitiesList.slice(0, 5), "Espresso Machine"];
        } else {
          amenities = [...amenitiesList]; // All amenities
        }

        rooms.push({
          id: i,
          name: `Room ${roomNum}`,
          type: type,
          pricePerNight: pricePerNight,
          description: `A elegant and well-appointed ${type.toLowerCase()} located on Floor ${floor}. It features modern amenities, premium bedding, and a peaceful atmosphere designed for both leisure and business travelers.`,
          amenities: amenities,
        });
      }
      
      resolve(rooms);
    }, 400);
  });
};