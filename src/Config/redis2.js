const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

// Redis 클라이언트 생성
const redisClient = createClient({
  legacyMode: false,
  url: 'redis://localhost:6379',
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis 클라이언트 연결 성공');
  } catch (error) {
    console.error('Redis 클라이언트 연결 실패:', error);
  }
})();

redisClient.on('error', (err) => {
  console.error('Redis 클라이언트 에러:', err);
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'session:',
  ttl: 60 * 60 * 24,
});





module.exports = { redisClient, redisStore };
