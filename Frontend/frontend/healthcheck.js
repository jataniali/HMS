const http = require('http');

const options = {
  host: 'localhost',
  port: 5000,
  path: '/',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('Error:', err);
  process.exit(1);
});

request.end();
