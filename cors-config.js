// cors-config.js

const getCorsConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // 허용할 클라이언트 URL 목록
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  // 환경변수 기반 추가
  if (process.env.CLIENT_URL) {
    const clientUrls = process.env.CLIENT_URL.split(',').map(url => url.trim());
    allowedOrigins.push(...clientUrls);
  }

  // 프로덕션 환경
  if (!isDevelopment) {
    const vercelUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`
      : null;

    const prodUrl = process.env.PRODUCTION_CLIENT_URL || 'https://pwd-week6-client.vercel.app';
    const defaultUrl = process.env.DEFAULT_CLIENT_URL;

    if (vercelUrl) allowedOrigins.push(vercelUrl);
    if (prodUrl) allowedOrigins.push(prodUrl);
    if (defaultUrl) allowedOrigins.push(defaultUrl);
  }

  console.log('🔧 CORS Config:', allowedOrigins);

  return {
    origin: (origin, callback) => {
      // 서버 간 호출 (헬스체크 등)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS 허용: ${origin}`);
        callback(null, true);
      } else {
        console.warn(`❌ CORS 차단: ${origin}`);
        console.log('허용 목록:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // 🔥 반드시 유지
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ 추가
    allowedHeaders: ['Content-Type', 'Authorization'], // ✅ 추가
    exposedHeaders: ['set-cookie'], // ✅ 추가 (브라우저가 Set-Cookie 헤더를 인식)
    optionsSuccessStatus: 200,
  };
};

module.exports = getCorsConfig;