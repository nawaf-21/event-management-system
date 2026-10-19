
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const alreadyExists = users.some(
      (user) => user.email === email
    );

    if (alreadyExists) {
      alert("This email is already registered.");
      return;
    }

    users.push({
      name: name,
      email: email,
      password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please log in.");
    navigate("/login");
  }

  return (
    <div className="page">
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            minLength={6}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
