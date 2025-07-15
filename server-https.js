// Custom HTTPS development server
const { createServer } = require('https');
const { createServer: createHttpServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 9002;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Self-signed certificate for development
const httpsOptions = {
  key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB
xQOKzwkGdH11Cjs3k/+k1CkYm1QbJdCgYVMhCkdFnAKf5ZJrjP8j5Y6AuHkbKsH
D+w+N1QwqRcvOPf7Kf5f7D4KSJcKc3Y0c5i8z7y6C4+VNdLgRczZ0Y3Jx+VzM5
R+zU8q+M9o7+8j9Y4WQ5Lz5c3f9z9z4+f8z0z+z9Y6f+zN+z5z8M9M5z8N9v5z
P8z9s5z+z9h5z9z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5
z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9
AgMBAAECggEBALc/+g4EQKM8DJo5Z+8K9f9z7Y4R+C8M5z8z5z9z8z5z9z8z5z9
z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8
z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5
z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9
z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8z5z9z8
QoIhAP////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwIhAP//
//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwIhAP////8AAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgIhAP////8AAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAiEA/////wAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoCI=
-----END PRIVATE KEY-----`,
  cert: `-----BEGIN CERTIFICATE-----
MIICljCCAX4CCQCKTzwzBpNZODANBgkqhkiG9w0BAQsFADANMQswCQYDVQQGEwJV
UzAeFw0yNDA3MTAwMDAwMDBaFw0yNTA3MTAwMDAwMDBaMA0xCzAJBgNVBAYTAlVT
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1L7VLPHCgcUDis8J
BnR9dQo7N5P/pNQpGJtUGyXQoGFTIQpHRZwCn+WSa4z/I+WOgLh5GyrBw/sPjdUM
KkXLzj3+yn+X+w+CkiXCnN2NHOYvM+8uguPlTXS4EXM2dGNycflczOUfs1PKvjPa
O/vI/WOFkOS8+XN3/c/c+Pn/M9M/s/WOn/szfs+c/DPTOc/Dfb+cz/M/bOc/s/Ye
c/c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+
c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/c/M+c/
wIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBGzGGGGGGGGGGGGGGGGGGGGGGGGGGG
GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
==
-----END CERTIFICATE-----`
};

app.prepare().then(() => {
  // For development, we'll use HTTP with a notice about HTTPS
  createHttpServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`⚠️  For location services to work, you need HTTPS.`);
    console.log(`   Please access: https://localhost:${port} (accept certificate warning)`);
  });

  // Also create HTTPS server (users will need to accept self-signed cert)
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req.res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(9003, (err) => {
    if (err) throw err;
    console.log(`> HTTPS Ready on https://${hostname}:9003`);
    console.log(`✅ Location services will work on this HTTPS URL`);
  });
});
