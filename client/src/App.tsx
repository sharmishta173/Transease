import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BusList from "./pages/BusList";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirm from "./pages/BookingConfirm";
import AnimatedBackground from "./components/animations/AnimatedBackground";

function App() {
  return (
    <BrowserRouter>
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buses" element={<BusList />} />
        <Route path="/buses/:busId" element={<SeatSelection />} />
        <Route path="/confirm" element={<BookingConfirm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;