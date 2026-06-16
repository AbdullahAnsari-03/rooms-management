import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const useRooms = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useRooms must be used within an AppProvider");
  }
  return { rooms: context.rooms, loading: context.loadingRooms };
};

export default useRooms;