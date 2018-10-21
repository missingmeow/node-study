
const testapi = require('./testapi');

module.exports = (app) =>{

    app.get('/', (req, res) => {
        res.send("Hello World!");
    })

    app.use('/api', testapi)
} 