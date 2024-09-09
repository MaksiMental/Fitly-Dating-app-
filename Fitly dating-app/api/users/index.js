const db = require('../shared/dbConnect');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    try {
        await db.startDB();
    } catch(error) {
        console.log("Error connecting to the database", error.message);
    }
    switch (req.method) {
        case 'GET':
            await get(context, req);
            break
        case 'POST':
            await post(context, req);
            break
        case 'PUT':
            await put(context, req);
            break
        case 'DELETE':
            await remove(context, req);
            break
    }
}

async function get(context, req) {
    try{
        let id = req.query.id;
        let user = await db.select(id);
        context.res = {
            body: user
        };
    } catch(err) {
        context.res = {
            status: 400,
            body: `No user - ${err.message}`
        }
    }
}

async function post(context, req) {
    try{
        console.log(req);
        let payload = req.body;
        await db.insert(payload);
        context.res = {
            body: {status: 'Success'}
        };
    } catch(error) {
        context.res = {
            status: 400,
            body: error.message
        }
    }
}

async function put(context, req) {
    try{
        console.log(req)
        let payload = req.body;
        await db.update(payload, req.headers);
        context.res = {
            body: {status: 'Updated user successfully!'}
        };
    } catch(error) {
        context.res = {
            status: 400,
            body: error.message
        }
    }
}

async function remove(context, req) {
    try{
        console.log(req)
        await db.deleteUser(req.headers);
        context.res = {
            body: 'Brugeren er nu slettet'
        };
    } catch(err) {
        context.res = {
            status: 400,
            body: `No user - ${err.message}`
        }
    }
}