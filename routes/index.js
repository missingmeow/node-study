
const testapi = require('./testapi');

const httpStatus = require('../utils/httpStatus');

module.exports = (app) => {

    app.get('/', httpStatus.ensureAuthenticated, (req, res) => {
        res.send(`Hello World! the ${req.session.views[req.originalUrl]} times`);
    })

    app.get('/login', (req, res) => {
        res.render('login.html');
    })

    app.post('/login', (req, res) => {
        if (req.body.username === 'admin' && req.body.password === 'admin') {
            // res.cookie('name', req.body.username, { signed: true });
            req.session.username = req.body.username;
            res.send('login successful');
        } else {
            res.status(409).send({ message: 'wrong password' });
        }
    })

    app.use('/api', testapi)
}
