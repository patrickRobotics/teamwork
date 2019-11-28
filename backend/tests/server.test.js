const { expect } = require('chai');
const request = require('request');
const server = require('../server');

// eslint-disable-next-line no-undef
describe('Test App Server', () => {
    const url = 'http://localhost:3000/';
    // eslint-disable-next-line no-undef
    it('should return statuscode 200', (done) => {
        request(url, (error, response) => {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    // eslint-disable-next-line no-undef
    it('should return body json text', (done) => {
        request(url, (error, response, body) => {
            expect(body).to.equal('{"info":"Node.js, Express, and Postgres API"}');
            done();
        });
    });
});
