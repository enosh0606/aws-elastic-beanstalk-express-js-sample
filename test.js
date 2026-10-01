const assert = require('assert');
const http = require('http');
const app = require('./app');

const server = app.listen(0, () => {
    const port = server.address().port;

    http.get(`http://127.0.0.1:${port}/`, (res) => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                assert.strictEqual(res.statusCode, 200);
                assert.strictEqual(data, 'Hello World!');
                console.log('Test passed successfully');
                server.close(() => process.exit(0));
            } catch (error) {
                console.error('Test failed:', error.message);
                server.close(() => process.exit(1));
            }
        });
    }).on('error', (error) => {
        console.error('Test failed:', error.message);
        server.close(() => process.exit(1));
    });
});
