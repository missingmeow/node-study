
const testapi = require('./testapi');

const ensureAuthenticated = require('../utils/httpStatus').ensureAuthenticated;

module.exports = (app) => {

    app.get('/', ensureAuthenticated, (req, res) => {
        res.send('Hello World!');
    })

    app.get('/login', (req, res) => {
        res.render('login.html');
    })

    app.post('/login', (req, res) => {
        if (req.body.username === 'admin' && req.body.password === 'admin') {
            res.cookie('name', req.body.username, { signed: true });
            res.send('login successful');
        } else {
            res.status(409).send({ message: 'wrong password' });
        }
    })

    app.use('/api', testapi)
}
