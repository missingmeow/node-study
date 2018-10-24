
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

function ensureAuthenticated(req, res, next) {
    if (req.signedCookies.name) {
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
}
