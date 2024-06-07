import app from "./app";
import { connectRedis } from "./utils/redis-client";

const startServer = async () => {
  try {
    await connectRedis();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server is runing on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`An error occoured`, error);
    process.exit(1);
  }
};

startServer();
