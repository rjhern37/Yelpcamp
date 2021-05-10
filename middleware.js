module.exports.isLoggedIn = (req, res, next) => {
	console.log('REQ.USER...', req.user);
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be logged in to continue.');
		return res.redirect('/login');
	}
	next();
};
