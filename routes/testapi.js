
const express = require('express');
const fs = require('fs');
const { check, validationResult } = require('express-validator/check');

const httpStatus = require('../utils/httpStatus');

const router = express.Router();

function ReadData() {
    try {
        const data = fs.readFileSync('data.json');
        if (data === '') {
            return [];
        }
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

router.post('/testapi', httpStatus.ensureAuthenticated, [
    check('username').isString().withMessage('need username')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return httpStatus.validationError(res, errors);
    }

    let data = ReadData();
    for (let i = 0; i < data.length; ++i) {
        if (data[i].username === req.body.username) {
            return res.status(409).send({ message: 'username has been created' });
        }
    }

    data.push(req.body);

    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(201).send();
})

router.put('/testapi', httpStatus.ensureAuthenticated, (req, res) => {
    if (!req.body.username) {
        return res.status(400).send({ message: 'need username' });
    }

    let data = ReadData();
    let i = 0;
    for (; i < data.length; ++i) {
        if (data[i].username === req.body.username) {
            break;
        }
    }

    if (i === data.length) {
        return res.status(404).send({ message: `can not find user: ${req.body.username}` });
    }

    if (req.body.age) {
        data[i].age = req.body.age;
    }

    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(200).send();
})

router.delete('/testapi', httpStatus.ensureAuthenticated, (req, res) => {
    if (!req.body.username) {
        return res.status(400).send({ message: 'need username' });
    }

    let data = ReadData();
    let i = 0;
    for (; i < data.length; ++i) {
        if (data[i].username === req.body.username) {
            break;
        }
    }

    if (i === data.length) {
        return res.status(404).send({ message: `can not find user: ${req.body.username}` });
    }

    data.splice(i, 1);

    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(200).send();
})

module.exports = router
