
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyEvents from "./pages/MyEvents";
import { logout } from "./redux/authSlice";
import EventDetails from "./pages/EventDetails";

function Navigation() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
    window.location.reload();
  }

  return (
    <nav>
      <h2>Event Manager</h2>
      <Link to="/">Home</Link>{" "}

      {user ? (
        <>
          <span>Welcome, {user.name}</span>{" "}
          <Link to="/my-events">My Events</Link>{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        
        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
