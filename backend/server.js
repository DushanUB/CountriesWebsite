const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    favorites: [String] // Store country codes
});
const User = mongoose.model("User", userSchema);

// **Register User**
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// **Login User**
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } else {
        res.status(400).json({ message: "Invalid credentials" });
    }
});

// **Manage Favorites**
app.post("/favorites", async (req, res) => {
    const { userId, countryCode } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { favorites: countryCode } });
    res.json({ message: "Country added to favorites" });
});

app.get("/favorites/:userId", async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.json(user.favorites);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));