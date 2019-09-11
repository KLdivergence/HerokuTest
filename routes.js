var pasFectcher = require('./lib/pasFectcher.js');

module.exports = function(app) {
    app.post('/gethistory',pasFectcher.gethistory);
}; 