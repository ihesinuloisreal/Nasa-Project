const request = require('supertest')
const app = require('../../app')
const existLaunch = require('../../models/launches.model')


describe('Test Get /launches', () => {
    test("It should respond with 200 success", async() => {
        const response = await request(app)
        .get('/launches')
        .expect(200)
        .expect('Content-Type', /json/);
    });
});

describe('Test POST /launch', ()=> {
    const completeData = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'January 4, 2028'
    };
    const completeDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f'
    };
    const lauchDataWithInvalidDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'zoo'
    }
    
    test('It should respond with 201 created', async()=> {
        const response = await request(app)
        .post('/launches')
        .send(completeData)
        .expect(201)
        .expect('Content-Type', /json/);

    const requestDate = new Date(completeData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate).toBe(responseDate)
    expect(response.body).toMatchObject(completeDataWithoutDate);
    expect(response.body.flightNumber).toBe(101)
    
    });
    test('It should catch missing required properties', async()=> {
        const response = await request(app)
        .post('/launches')
        .send(completeDataWithoutDate)
        .expect(400)
        .expect('Content-Type', /json/);
    
        expect(response.body).toStrictEqual({
            error: 'Missing required launch property',
        })
    });
    test('It should catch invalid dates', async ()=> {
        const response = await request(app)
        .post('/launches')
        .send(lauchDataWithInvalidDate)
        .expect(400)
        .expect('Content-Type', /json/);
    
        expect(response.body).toStrictEqual({
            error: "Invalid launch date",
        })

    });
});

describe('Abort Launch', ()=> {
    const validLaunchId =  101;
    const invalidLaunchId = 111;

    test('It should respond with 200, and set upcoming and success to false', async ()=>{
        const response = await request(app)
        .delete(`/launches/${validLaunchId}`)
        .expect(200)

        const upcoming = response.body.upcoming;
        const success = response.body.success;

        expect(upcoming).toBe(false);
        expect(success).toBe(false);
    });
    test('It should respond with Not Found 404', async ()=>{
        const response = await request(app)
        .delete(`/launches/${invalidLaunchId}`)
        .expect(404)

        expect(response.body).toStrictEqual({
            error: 'Launch not found',
        })
    })

    test('It should return false if launch id is invalid', ()=>{
        const exist = existLaunch.existsLaunchWithId
        expect(exist(invalidLaunchId)).toBe(false)
    })
    
});