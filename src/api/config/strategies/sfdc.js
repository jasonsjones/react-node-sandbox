import dotenv from 'dotenv';
import PassportSFDC from 'passport-forcedotcom';
import User from '../../user/user.model';

dotenv.config();
const ForceDotComStategy = PassportSFDC.Strategy;

const createNewUser = (token, refreshToken, userData) => {
    let newUser = new User();
    newUser.name = userData.display_name;
    newUser.email = userData.email;
    newUser.sfdc = {
        id: userData.user_id,
        accessToken: token,
        refreshToken: refreshToken,
        profile: userData
    }
    return newUser.save();
};

const linkAccount = (req, token, refreshToken, profile) => {
    let user = req.user;
    if (user) {
        user.sfdc = {};
        user.sfdc.id = profile.user_id;
        user.sfdc.accessToken = token;
        user.sfdc.refreshToken = refreshToken;
        user.sfdc.profile = profile;
        return user.save();
    } else {
        Promise.reject(new Error('Unable to link accounts.  User not authenticated.'));
    }
};

const opts = {
    clientID: process.env.SFDC_CLIENT_ID,
    clientSecret: process.env.SFDC_CLIENT_SECRET,
    scope: ['full'],
    callbackURL: 'http://localhost:3000/auth/callback',
    passReqToCallback: true
};

const verifyCb = (req, token, refreshToken, profile, done) => {
    // if a user is not currently logged in
    if (!req.isAuthenticated()) {
        const { user_id } = profile._raw;
        User.findOne({'sfdc.id': user_id}).exec()
            .then(user => {
                // check if the user is already in the db
                if (user) {
                    return done(null, user);
                // if not, create a new user and save in db
                } else {
                    return createNewUser(token, refreshToken, profile._raw);
                }
            })
            .then(user => {
                if (user) {
                    req.login(user, () => {
                        console.log('new user saved and logged in...');
                    });
                    return done(null, user);
                }
            })
            .catch(err => done(err, null));
    }
    // else the user is already logged in and we might want to 'link'
    // the sfdc data to the existing account
    else {
        linkAccount(req, token, refreshToken, profile._raw)
            .then(user => {
                return done(null, user);
            })
            .catch(err => done(err, null));
    }
}

export default new ForceDotComStategy(opts, verifyCb);
