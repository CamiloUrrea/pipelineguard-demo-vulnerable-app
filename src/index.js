const _ = require('lodash');
const http = require('http');

const defaultConfig = { theme: 'light', notifications: true };

// Insecure on purpose: merging an untrusted request body straight into an
// object with lodash's deep merge is a classic prototype-pollution vector
// (see CVE-2018-3721 / CVE-2019-10744) on lodash < 4.17.21.
function buildUserConfig(requestBody) {
  return _.merge({}, defaultConfig, requestBody);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/config') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const requestBody = JSON.parse(body || '{}');
        const merged = buildUserConfig(requestBody);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(merged));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`pipelineguard-demo-vulnerable-app listening on port ${PORT}`);
  });
}

module.exports = { buildUserConfig, server };
