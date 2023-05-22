const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const session = require('express-session');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/create', (req, res) => {
  res.render('search');
});

app.use((req, res, next) => {
  if (req.query.target) {
    req.session.target = req.query.target;
  }

  if (!req.session.target) {
    return res.redirect('/create');
  }

  const proxy = createProxyMiddleware({
    target: req.session.target,
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      if (proxyRes.statusCode === 302) {
        proxyRes.statusCode = 200;
      }
    },
  });

  // Handle requests for static assets (CSS, JS, images)
  if (req.url.includes('.css') || req.url.includes('.js') || req.url.includes('.png') || req.url.includes('.jpg')) {
    return proxy(req, res, next);
  }

  // Handle other requests with the proxy middleware
  proxy(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Unblocker server is running on port ${PORT}`);
});
