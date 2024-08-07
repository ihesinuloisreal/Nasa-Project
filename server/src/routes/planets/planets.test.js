const request = require('supertest');
const app = require('../../app');
const httpRoute = require('./planets.controller')

describe('Test GET /planet', ()=> {
    test('It should respond with 200 success', async()=>{
        await request(app)
        .get('/planets')
        .expect(200);
    });
    
});