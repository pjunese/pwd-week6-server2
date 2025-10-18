// src/routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth.middleware');

const router = express.Router();

// ==================== 로컬 인증 ====================
// 회원가입
router.post('/register', isNotAuthenticated, authController.register);

// 로그인
router.post('/login', isNotAuthenticated, authController.login);

// 로그아웃
router.post('/logout', isAuthenticated, authController.logout);

// OAuth 설정 여부 확인
const isGoogleAuthConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const isNaverAuthConfigured = Boolean(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET);

// 현재 사용자 정보
router.get('/me', authController.getCurrentUser);

// OAuth 설정 정보 제공
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      providers: {
        google: isGoogleAuthConfigured,
        naver: isNaverAuthConfigured,
      },
    },
  });
});

// ==================== 구글 OAuth ====================
if (isGoogleAuthConfigured) {
  // 구글 로그인 시작
  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  // 구글 콜백
  router.get('/google/callback', authController.googleCallback);
} else {
  router.get('/google', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Google OAuth가 설정되어 있지 않습니다. 관리자에게 문의하세요.',
    });
  });
}

// ==================== 네이버 OAuth ====================
if (isNaverAuthConfigured) {
  // 네이버 로그인 시작
  router.get(
    '/naver',
    passport.authenticate('naver')
  );

  // 네이버 콜백
  router.get('/naver/callback', authController.naverCallback);
} else {
  router.get('/naver', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Naver OAuth가 설정되어 있지 않습니다. 관리자에게 문의하세요.',
    });
  });
}

module.exports = router;
