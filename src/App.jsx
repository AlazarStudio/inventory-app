import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import EOQPage from "./pages/EOQPage";
import Analytics from "./pages/Analytics";
import Theory from "./pages/Theory";
import Products from "./pages/Products";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eoq" element={<EOQPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/theory" element={<Theory />} />
      </Routes>
    </>
  );
}
