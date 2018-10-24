
const express = require('express');
const fs = require('fs');

const httpStatus = require('../utils/httpStatus');

const router = express.Router();

function ReadData() {
    try {
        const data = fs.readFileSync('data.json');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

router.get('/testapi', httpStatus.ensureAuthenticated, (req, res) => {
    const data = ReadData();
    // req.query 不为空时，说明api可能是: /testapi/?username=fesega
    if (JSON.stringify(req.query) !== '{}') {
        if (req.query.username) {
            let i = 0;
            for (; i < data.length; ++i) {
                if (data[i].username === req.query.username) {
                    res.send(data[i]);
                    break;
                }
            }
            if (i === data.length) {
                res.status(404).send({ message: 'can not find user: ' + req.query.username });
            }
        } else {
            res.status(400).send({ message: 'some wrong with query' });
        }
    } else {
        res.send(data);
    }
})

router.get('/testapi/:id', httpStatus.ensureAuthenticated, (req, res) => {
    const data = ReadData();
    let i = 0;
    for (; i < data.length; ++i) {
        if (data[i].username === req.params.id) {
            res.send(data[i]);
            break;
        }
    }
    if (i === data.length) {
        res.status(404).send({ message: 'can not find user: ' + req.params.id });
    }
})

router.post('/testapi', httpStatus.ensureAuthenticated, (req, res) => {
    if (!req.body.username) {
        res.status(400).send({ message: 'need username' });
        return;
    }

    let data = ReadData();
    for (let i = 0; i < data.length; ++i) {
        if (data[i].username === req.body.username) {
            res.status(409).send({ message: 'username has been created' });
            return;
        }
    }

    if (req.body.age) {
        data.push({ username: req.body.username, age: req.body.age });
    } else {
        data.push({ username: req.body.username });
    }
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.status(201).send();
})

router.put('/testapi', httpStatus.ensureAuthenticated, (req, res) => {
    if (!req.body.username) {
        res.status(400).send({ message: 'need username'});
        return;
    }

    let data = ReadData();
    let i = 0;
    for (; i < data.length; ++i) {
        if (data[i].username === req.body.username) {
            break;
        }
    }

    if (i === data.length) {
        res.status(404).send({ message: `can not find user: ${req.body.username}` });
        return;
    }

    if (req.body.age) {
        data[i].age = req.body.age;
    }

    fs.writeFileSync('data.json', JSON.stringify(data));
    res.status(200).send();
})

router.delete('/testapi', httpStatus.ensureAuthenticated, (req, res) => {
    if (!req.body.username) {
        res.status(400).send({ message: 'need username' });
        return;
    }

    let data = ReadData();
    let i = 0;
    for (; i < data.length; ++i) {
        if (data[i].username === req.body.username) {
            break;
        }
    }

    if (i === data.length) {
        res.status(404).send({ message: `can not find user: ${req.body.username}` });
        return;
    }

    data.splice(i, 1);

    fs.writeFileSync('data.json', JSON.stringify(data));
    res.status(200).send();
})

module.exports = router
