import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import Header from "./components/Header";
import RoomListingPage from "./pages/RoomListingPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <Header />
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            <Route path="/rooms" element={<RoomListingPage />} />
            <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
            <Route path="/booking/:bookingId" element={<BookingDetailsPage />} />
            <Route path="*" element={<Navigate to="/rooms" replace />} />
          </Routes>
        </main>
      </Router>
    </AppProvider>
  );
}

export default App;
