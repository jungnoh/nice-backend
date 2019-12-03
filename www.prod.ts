import createApp from './src/server';

import fs from 'fs';
import http from 'http';
import https from 'https';

createApp().then((app) => {
  const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
  const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
  const credentials = {key: privateKey, cert: certificate};

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);

  httpServer.listen(8080);
  httpsServer.listen(8443);
});
