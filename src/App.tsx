import { Route, Routes } from "react-router-dom";
import FloatingHearts from "./components/FloatingHearts";
import GuestPage from "./components/GuestPage";
import HomePage from "./components/HomePage";

export default function App() {
  return (
    <div className="app-shell">
      <FloatingHearts />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guest/:id" element={<GuestPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}
