# 🏨 LuxeStay – Hotel Room Booking Calendar

A modern React-based hotel room booking management system designed to help hotel staff efficiently manage room availability, reservations, occupancy, and revenue through an interactive calendar interface.

## 🌐 Live Demo

**Live Application:** https://luxe-stay-silk.vercel.app/#/rooms

## 📌 Features

### Room Availability Calendar

* Interactive 30-day booking calendar
* Rooms displayed as rows and dates as columns
* Clear visualization of room availability
* Color-coded booking status indicators
* Quick navigation to room and booking details

### Booking Management

* Create new bookings
* Edit existing bookings
* Cancel reservations
* View detailed booking information
* Automatic prevention of overlapping bookings

### Advanced Filtering

* Filter rooms by type
* Filter rooms by price range
* Search rooms available on a specific date
* Reset filters with a single click

### Dashboard Insights

* Total room count
* Available rooms today
* Occupied rooms today
* Revenue estimation for selected date ranges
* Dynamic metrics that update in real time

### Data Persistence

* Booking data stored in Local Storage
* Filter preferences preserved across browser sessions
* Seamless user experience after page refreshes

### Performance Optimization

* Virtualized rendering using `react-window`
* Optimized calculations using `useMemo`
* Optimized event handlers using `useCallback`
* Efficient booking lookup structure for fast rendering

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Vite
* Modern CSS
* Context API

### Libraries

* date-fns
* react-window

### State Management

* Context API
* Custom React Hooks

---

## ✨ Key Highlights

* Interactive room booking calendar with 30-day visibility
* Real-time booking management workflow
* Revenue and occupancy analytics dashboard
* Smart filtering system for room discovery
* Local Storage persistence for enhanced user experience
* Scalable architecture using Context API and Custom Hooks
* Performance-focused rendering using virtualization
* Responsive and user-friendly interface

---

## 🏗️ Project Structure

```text
src/
│
├── api/
│   ├── roomsApi.js
│   └── bookingsApi.js
│
├── components/
│   ├── CalendarGrid.jsx
│   ├── Filters.jsx
│   ├── Header.jsx
│   └── MetricsSummary.jsx
│
├── context/
│   ├── AppContext.js
│   ├── AppContext.jsx
│   └── AppProvider.jsx
│
├── hooks/
│   └── useRooms.js
│
├── pages/
│   ├── RoomListingPage.jsx
│   ├── RoomDetailsPage.jsx
│   └── BookingDetailsPage.jsx
│
└── App.jsx
```

---

## 📊 Revenue Calculation

Revenue is calculated based on booking duration and room pricing within the selected date range.

```text
Revenue =
Number of Nights × Room Price Per Night
```

Only bookings overlapping the selected date range are considered in the calculation.

---

## 🧠 Performance Considerations

### useMemo

Used to optimize:

* Room filtering
* Calendar header generation
* Metrics calculations
* Booking lookup maps

### useCallback

Used to optimize:

* Booking operations
* Filter updates
* Availability validation

### Virtualized Rendering

The application uses `react-window` to efficiently render large room datasets, ensuring smooth performance even when managing hundreds of rooms.

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/AbdullahAnsari-03/rooms-management.git
cd rooms-management
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🚀 Deployment

The application is deployed on Vercel.

**Live URL:** https://luxe-stay-silk.vercel.app/#/rooms

---

## 👨‍💻 Developer

**Abdullah Ansari**

GitHub: https://github.com/AbdullahAnsari-03
LinkedIn: https://www.linkedin.com/in/abdullahansari03/

---
