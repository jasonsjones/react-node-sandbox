import dotenv from 'dotenv';
dotenv.config();

export default {
    'development': {
        'port': process.env.PORT || 3000,
        'token_secret': process.env.JWT_SECRET,
        'session_secret': process.env.SESSION_SECRET,
        'dbUrl': 'mongodb://mongo/sandboxapi'
    },
    'test': {
        'port': process.env.PORT || 3000,
        'token_secret': process.env.JWT_SECRET,
        'session_secret': process.env.SESSION_SECRET,
        'dbUrl': 'mongodb://mongo/testdb'
    }
}
