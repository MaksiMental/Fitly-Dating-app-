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
    }
}

async function get(context, req) {
    try{
        let matches = await db.selectMatchesAdmin(req.headers);
        context.res = {
            body: matches
        };
    } catch(err) {
        context.res = {
            status: 400,
            body: `No matches in database, ${err}`
        }
    }
}