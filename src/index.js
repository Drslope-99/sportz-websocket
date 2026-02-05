import express from "express";
const app = express();
const PORT = 8000;

// JSON middleware
app.use(express.json());

// GET route
app.get("/", (req, res) => {
  res.json({ message: "GET request received successfully" });
});

// Start server and log URL
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
