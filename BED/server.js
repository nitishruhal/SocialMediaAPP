const express = require('express')
const app = express()
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoute")
const mongoose = require('mongoose')
const cors = require('cors')
const authRoute = require("./routes/validationRoutes")
const mongoURI = 'mongodb+srv://nitish:nitishruhal1@cluster0.iwldmvb.mongodb.net/';

app.use(express.json());
app.use(cors());
app.use(userRoutes)
app.use(authRoute)
app.use(postRoutes)
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));




app.listen(5000, () => {
    console.log("server is running on port number 5000");
})