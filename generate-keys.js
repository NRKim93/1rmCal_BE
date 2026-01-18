const crypto = require('crypto');
const fs = require('fs');

// RSA 키 쌍 생성
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// 키를 파일로 저장
fs.writeFileSync('private.pem', privateKey);
fs.writeFileSync('public.pem', publicKey);

// Base64로 인코딩된 키 생성 (환경변수용)
const privateKeyBase64 = Buffer.from(privateKey).toString('base64');
const publicKeyBase64 = Buffer.from(publicKey).toString('base64');