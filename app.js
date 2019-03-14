// Imports
const express = require('express');
const session = require('express-session')
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const auth = require('basic-auth');

// Environment variables
require('dotenv').config()

// Config
const config = require('config');

// Models
const models = require('./models');

// Express app and master router
const app = express();
const router = express.Router();

// Session
app.use(session({
    resave: true,
    saveUninitialized: true,
    name: "name",
    secret: "secret"
}));

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Default use
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const simulate = require('./routes/simulate');

// Route setup involving async
function init() {

  if ( config.get('message_queue.ACTIVE') == true ) {

    var amqp = require('amqplib');
    var QueueMessage = require('./lib/messages/queueMessage');

    return amqp.connect('amqp://' + config.get('message_queue.HOST')).then(function(connection) {

      router.use('/simulate', simulate(new QueueMessage(connection, config.get('message_queue.NAME'))));

    }).catch(console.warn);

  } else {

    var HTTPMessage = require('./lib/messages/httpMessage');
    router.use('/simulate', simulate(new HTTPMessage()));
    return Promise.resolve();

  }

}

router.use('/', function(req, res, next) {

  const credentials = auth(req)

  if ( !credentials || credentials.name !== config.get('credentials.USERNAME') || credentials.pass !== config.get('credentials.PASSWORD') ) {

      res.status(401);
      res.header('WWW-Authenticate', 'Basic realm="forbidden"');
      res.send('Access denied');

  } else {

      next();

  }

});

app.use('/ehr', router);

///////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

init().then(() => app.listen(process.env.PORT || '3003')).catch(err => console.error(err));

module.exports = app;