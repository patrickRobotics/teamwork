const { expect } = require('chai');
const request = require('request');
const server = require('../index');

// eslint-disable-next-line no-undef
describe('Test App Server', () => {
    const url = 'http://localhost:3000/';
    // eslint-disable-next-line no-undef
    it('should return statuscode 200', () => {
        request(url, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
        });
    });
    // eslint-disable-next-line no-undef
    it('should return body json text', () => {
        request(url, (error, response, body) => {
            expect(response.body).to.equal('{"info":"Node.js, Express, and Postgres API"}');
        });
    });
});
