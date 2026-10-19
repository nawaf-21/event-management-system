
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import { setUserEvents } from "../redux/eventsSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      dispatch(login({ name: user.name, email: user.email }));

      const savedEvents = JSON.parse(
        localStorage.getItem("savedEvents_" + user.email) || "[]"
      );
      const registrations = JSON.parse(
        localStorage.getItem("registrations_" + user.email) || "[]"
      );

      dispatch(setUserEvents({
        savedEvents: savedEvents,
        registrations: registrations
      }));

      navigate("/");
    } else {
        alert("Invalid email or password.");
    }
  }

  return (
    <div className="page">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
