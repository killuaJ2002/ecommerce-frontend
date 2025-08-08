import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      // Navbar
      <div className="navbar">
        <div className="navbar-left">left of navbar</div>
        <div className="navbar-right">right of navbar</div>
      </div>
    </>
  );
};

export default HomePage;

// {isAuthenticated() ? (
//         <button onClick={handleLogout}>Logout</button>
//       ) : (
//         <Link to="/login">Login</Link>
//       )}
