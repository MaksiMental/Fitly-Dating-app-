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
    }
}

async function post(context, req) {
    try{
        let payload = req.body;
        let result = await db.login(payload, req.headers);
        context.res = {
            body: {status: 'Success', token: result.token},
        };
    } catch(error) {
        context.res = {
            status: 400,
            body: error.message
        }
    }
}



