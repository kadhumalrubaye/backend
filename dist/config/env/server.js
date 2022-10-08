// Path: ./config/env/production/server.js`
module.exports = ({ env }) => ({
    url: env('https://asi-backend.herokuapp.com'),
});
