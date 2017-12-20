import * as AuthUtils from './auth.utils';

export default (app, passport) => {

    app.get('/auth/sfdc',
        passport.authenticate('forcedotcom', {
            display: 'page',
            prompt: '',
            login_hint: ''
    }));

    app.get('/auth/callback',
        passport.authenticate('forcedotcom', {successRedirect: '/'}));

    app.get('/api/signout', (req, res) => {
        req.logout();
        req.session.destroy(() => {
            res.redirect('/login');
        });
    });

    app.post('/api/login',
        passport.authenticate('local'),
        (req, res) => {
            res.json({
                success: true,
                message: 'authenticated via passport',
                payload: {
                    user: req.user,
                    token: AuthUtils.generateToken(req.user)
                }});
        }
    );
}
