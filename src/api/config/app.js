import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'express-session';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';

import Config from './config';
import schema from '../graphql';
import authRoute from '../common/auth.routes';
import avatarRoute from '../avatar/avatar.routes';
import userRoute from '../user/user.routes';
import indexRoute from '../index/index.routes';

const env = process.env.NODE_ENV || "development";
const config = Config[env];

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

app.use(session({
    cookie: {
        secure: false
    },
    secret: config.session_secret,
    resave: false,
    saveUninitialized: true
}));

app.use('/graphql', graphqlHTTP({
    schema,
    pretty: true,
    graphiql: true
}));

authRoute(app);
avatarRoute(app);
userRoute(app);
indexRoute(app);

export default app;
