const db = require('../shared/dbConnect');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    try {
        await db.startDB();
    } catch(error) {
        console.log("Error connecting to the database", error.message);
    }
    switch (req.method) {
        case 'POST':
            await post(context, req);
            break
        case 'PUT':
            await put(context, req);
            break
    }
}

async function post(context, req) {
    try{
        let result = await db.auth(req.headers);
        context.res = {
            body: result
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
        
    } catch(error) {
        context.res = {
            status: 400,
            body: error.message
        }
    }
}