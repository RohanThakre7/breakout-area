const app = require('../server/server.js');

module.exports = (req, res) => {
    // This wrapper ensures Express handles the request correctly on Vercel
    try {
        return app(req, res);
    } catch (error) {
        console.error('Vercel API Wrapper Error:', error);
        res.status(500).json({
            code: 'API_WRAPPER_ERROR',
            message: error.message,
            stack: error.stack
        });
    }
};
