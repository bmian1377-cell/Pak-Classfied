import "./App.css";
import AppNavbar from "./component/Navbar";
import Footer from "./component/Footer";
import HeroCarousel from "./component/HeroCarousel";
import FormHandling from "./component/FormHandling";
import CarCategories from "./component/CarCategories";
import LatestPosting from "./component/LatestPosting";
import CategoryAds from "./component/CategoryAds";
import About from "./component/About";
import Contact from "./component/Contact";
import ScrollToTop from "./component/ScrollToTop"; 

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfile from "./pages/UserProfile";
import AdDetails from "./pages/AdDetails";
import SettingsPage from "./pages/SettingsPage";
import AllAdsPage from './pages/AllAdsPage';
import SearchPage from './pages/SearchPage';

// Components
import ProtectedRoute from "./component/ProtectedRoute";

// React Router & Toast
import { Routes, Route } from "react-router-dom"; // ScrollRestoration yahan se hata di
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Home Component
const Home = () => (
    <>
        <HeroCarousel />
        <FormHandling />
        <CarCategories />
        <LatestPosting />
    </>
);

function App() {
    return (
        <>
          
            <ScrollToTop /> 

            <AppNavbar />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/category/:categoryId" element={<CategoryAds />} />
                <Route path="/ad/:id" element={<AdDetails />} />
                <Route path="/all-ads" element={<AllAdsPage />}/>
                <Route path="/search" element={<SearchPage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* 404 Page */}
                <Route path="*" element={
                    <div className="text-center py-5">
                        <h2>404 - Page Not Found</h2>
                        <p>The page you are looking for does not exist.</p>
                        <a href="/" className="btn btn-success">Go Home</a>
                    </div>
                } />
            </Routes>

            <Footer />
            
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}

export default App;