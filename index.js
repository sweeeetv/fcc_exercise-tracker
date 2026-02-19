require("dotenv").config();
const mongoose = require("mongoose");
const createApp = require("./myApp");
//global variables
const TIMEOUT = 10000;
//create app
const app = createApp();

//connect to database
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
    //start server after successful database connection
    const PORT = process.env.PORT || 3000;
    const listener = app.listen(PORT, "0.0.0.0", () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1);
  }
};

startServer();
