function sendRefreshToken(res, token) {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        sameSite: true,
        path: '../services/auth.service.js',
    });
}

module.exports = { sendRefreshToken };