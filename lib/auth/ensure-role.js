module.exports = function getEnsureRole(role) {

    return function ensureRole(req, res, next) {
        const roles = req.user.role;
        if (roles && roles.indexOf && roles.indexOf(role) > -1) next();
        else next({
            code: 403,
            error: 'Unauthorized'
        });
    };
};
