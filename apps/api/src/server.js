import app from "./app.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is running on port:${process.env.APP_PORT}`);
    });
  } catch (err) {
    console.error("Failed to start api Error :", err.message);
    process.exit(1);
  }
};

startServer();
