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
        let users = await db.selectAdmin(req.headers);
        context.res = {
            body: users
        };
    } catch(err) {
        context.res = {
            status: 400,
            body: `Could not get any users`
        }
    }
}

async function put(context, req) {
    try{
        let payload = req.body;
        await db.updateAdmin(payload, req.headers);
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
        let id = req.query.id;
        let user = await db.deleteAdmin(id, req.headers);
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