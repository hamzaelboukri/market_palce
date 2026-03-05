// Test if backend auth routes are working
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/auth/callback',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Backend auth route exists!');
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
