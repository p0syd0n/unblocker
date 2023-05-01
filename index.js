const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.use(morgan('dev'));

app.use('/', (req, res, next) => {
  const target = "https://modified-chat-app.itemply.repl.co/"//req.url.replace('/', 'http://');
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
  });
  proxy(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Unblocker server is running on port \${PORT}`);
});
