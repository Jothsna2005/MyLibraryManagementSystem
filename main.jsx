import React, { useState, useEffect } from "react";

const PENALTY_PER_DAY = 10;
const BORROW_DAYS = 14;

const DEFAULT_BOOKS = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin" },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt" },
  { id: 3, title: "Design Patterns", author: "Erich Gamma" },
  { id: 4, title: "Eloquent JavaScript", author: "Marijn Haverbeke" },
  { id: 5, title: "Refactoring", author: "Martin Fowler" },
  { id: 6, title: "Effective Java", author: "Joshua Bloch" },
  { id: 7, title: "You Don’t Know JS", author: "Kyle Simpson" },
  { id: 8, title: "Operating System Concepts", author: "Silberschatz" },
  { id: 9, title: "Computer Networks", author: "Tanenbaum" },
  { id: 10, title: "Cracking the Coding Interview", author: "Gayle McDowell" },
  { id: 11, title: "Database System Concepts", author: "Abraham Silberschatz" },
  { id: 12, title: "Artificial Intelligence", author: "Stuart Russell" },
  { id: 13, title: "The Mythical Man-Month", author: "Frederick Brooks" },
  { id: 14, title: "Head First Design Patterns", author: "Eric Freeman" },
  { id: 15, title: "Introduction to Algorithms", author: "Cormen" },
  { id: 16, title: "JavaScript: The Good Parts", author: "Douglas Crockford" },
  { id: 17, title: "Domain-Driven Design", author: "Eric Evans" },
  { id: 18, title: "The Clean Coder", author: "Robert C. Martin" },
  { id: 19, title: "Code Complete", author: "Steve McConnell" },
  { id: 20, title: "Programming Pearls", author: "Jon Bentley" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function addDaysISO(dateISO, days) {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [borrowed, setBorrowed] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    const savedBorrows = JSON.parse(localStorage.getItem("borrows")) || [];
    setBorrowed(savedBorrows);
  }, []);

  useEffect(() => {
    localStorage.setItem("borrows", JSON.stringify(borrowed));
  }, [borrowed]);

  const handleLogin = (email, pass) => {
    if (!email || !pass) return alert("Please enter both email and password!");
    setUser({ email });
  };

  const handleLogout = () => setUser(null);

  const handleBorrow = () => {
    if (!selectedTitle) return alert("Please choose a book title!");
    const book = DEFAULT_BOOKS.find((b) => b.title === selectedTitle);
    if (!book) return;
    const already = borrowed.find((r) => r.bookId === book.id && !r.returnDate);
    if (already) return alert("You already borrowed this book!");

    const borrowDate = todayISO();
    const dueDate = addDaysISO(borrowDate, BORROW_DAYS);
    const record = {
      id: Date.now(),
      bookId: book.id,
      title: book.title,
      borrowDate,
      dueDate,
      returnDate: null,
      penalty: 0,
    };
    setBorrowed([record, ...borrowed]);
    alert(`Borrowed "${book.title}" successfully! Due on ${dueDate}`);
  };

  const handleReturn = (id) => {
    const updated = borrowed.map((r) => {
      if (r.id === id && !r.returnDate) {
        const today = todayISO();
        const diff =
          (new Date(today) - new Date(r.dueDate)) / (1000 * 60 * 60 * 24);
        const penalty = diff > 0 ? diff * PENALTY_PER_DAY : 0;
        return { ...r, returnDate: today, penalty };
      }
      return r;
    });
    setBorrowed(updated);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📚 Library Management System</h1>
      <p>
        Logged in as <b>{user.email}</b>{" "}
        <button onClick={handleLogout}>Logout</button>
      </p>

      <h3>Select Book to Borrow</h3>
      <select
        value={selectedTitle}
        onChange={(e) => setSelectedTitle(e.target.value)}
        style={{ width: 300, padding: 6, marginRight: 10 }}
      >
        <option value="">-- Select Book Title --</option>
        {DEFAULT_BOOKS.map((b) => (
          <option key={b.id} value={b.title}>
            {b.title} — {b.author}
          </option>
        ))}
      </select>
      <button onClick={handleBorrow}>Borrow</button>

      <h3 style={{ marginTop: 30 }}>Borrowed Books</h3>
      <div style={{ border: "1px solid #ccc", padding: 10 }}>
        {borrowed.length === 0 && <p>No borrowed books yet.</p>}
        {borrowed.map((r) => (
          <div
            key={r.id}
            style={{
              borderBottom: "1px solid #eee",
              padding: 6,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <b>{r.title}</b> <br />
              Borrowed: {r.borrowDate} | Due: {r.dueDate}
              {r.returnDate && (
                <div>
                  Returned: {r.returnDate} | Penalty: ₹{r.penalty}
                </div>
              )}
            </div>
            {!r.returnDate && (
              <button onClick={() => handleReturn(r.id)}>Return</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onLogin(email, pass);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Login
        </button>
      </form>
      <p style={{ color: "#666", fontSize: 13, marginTop: 10 }}>
      </p>
    </div>
  );
}
