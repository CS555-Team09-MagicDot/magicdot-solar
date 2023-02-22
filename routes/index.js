const homepageRoutes = require('./homepage');
const adminRoutes = require('./admin');

const constructorMethod = (app) => {
    app.use('/', homepageRoutes);
    app.use('/', adminRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({error: 'not found'});
    });
};

module.exports = constructorMethod;