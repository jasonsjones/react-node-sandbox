const env = process.env.NODE_ENV || "development";

import app from './config/app';
import Config from './config/config';
import db from './config/db';

const config = Config[env];
db(config);

app.listen(config.port, () => {
    console.log(`node server running on port ${config.port}`);
});
