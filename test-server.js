const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ status: res.statusCode, headers: res.headers });
    }).on('error', (err) => {
      resolve({ error: err.message, code: err.code });
    });
  });
}

async function main() {
  console.log("Checking Homepage...");
  const home = await checkUrl('http://localhost:3000/');
  console.log("Homepage response:", home);

  console.log("Checking Profile Image...");
  const img = await checkUrl('http://localhost:3000/profile.jpg');
  console.log("Profile Image response:", img);
}

main();
