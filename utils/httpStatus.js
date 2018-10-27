
function accountUnauthoried(res) {
    res.status(401).send({
        code: 'accountUnauthoried',
        message: '用户还没有登录，不能进行操作'
    })
}

function resourceNotFound(req, res, next) {
    res.status(404).send({
        code: 'resourceNotFound',
        message: '资源没有找到'
    })
}

function validationError(res, errors) {
    res.status(422).json({
        code: 'validationError',
        error: errors.array()
    })
}

function ensureAuthenticated(req, res, next) {
//    if (req.signedCookies.name) {
//        return next();
//    }
    if (!req.session.views) {
        req.session.views = {}
    }
    // count the views
    req.session.views[req.originalUrl] = (req.session.views[req.originalUrl] || 0) + 1

    if (req.session.username) {
        return next();
    }
    if (req.baseUrl === '/api') {
        return accountUnauthoried(res)
    }
    return res.redirect('/login')
}

module.exports = {
    resourceNotFound,
    ensureAuthenticated,
    accountUnauthoried,
    validationError,
}
