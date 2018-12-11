const express = require('express');

const routerCats = require('./routes/api/v1.0/cats');
// API/V1.0/
//API/V2.0/
const app = express();
require('./models');

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// кросдоменный запрос
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

require('./config/config-passport');
app.use('/reg', require('./routes/reg'));
app.use('/token', require('./routes/auth'));
app.use('/api/v1.0/cats', routerCats);

app.use((req, res, next) => {
  res
    .status(404)
    .json({ err: '404', message: 'Use api on routes /api/v1.0/cats' });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ err: '500', message: err.message });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, function() {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
} else {
  module.exports = app;
}
