import { createClient } from "redis";

let redisClient: any;

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:6379`,
    });
    redisClient.on("connect", () => console.log("Connected to Redis"));
    redisClient.on("error", (err: any) =>
      console.log("Redis Client Error", err)
    );
  }
  return redisClient;
};

const connectRedis = async () => {
  const client = getRedisClient();
  if (!client.isOpen) {
    await client.connect();
  }
};

export { connectRedis, getRedisClient };
