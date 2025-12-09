import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import "./index.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import SavingsCalculator from "./components/SavingsCalculator";
import Header from "./components/Header";
import Team from "./pages/Team";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        {/* Header */}
        <Header />
        {/* Main Page Content */}
        <main className="flex flex-1 justify-center py-8">
          <div className="w-full max-w-7xl px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/team" element={<Team />} />
              <Route path="/savings-calculator" element={<SavingsCalculator />} />
            </Routes>
          </div>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
