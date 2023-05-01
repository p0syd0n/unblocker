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
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/create', (req, res) => {
  res.render('search')
});

app.use('/', (req, res, next) => {
  if (req.query.target) {
    req.session.target = req.query.target;
    const target = req.session.target;//req.url.replace('/', 'http://');
    const proxy = createProxyMiddleware({//https://modified-chat-app.itemply.repl.co
      target,
      changeOrigin: true,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
    });
    proxy(req, res, next);
  } else {
    res.redirect('/create')
  }

});

app.listen(PORT, () => {
  console.log(`Unblocker server is running on port ${PORT}`);
});
