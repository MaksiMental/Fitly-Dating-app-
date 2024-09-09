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
        let id = req.query.id;
        await db.likeUser(id, req.headers);
        let result = await db.checkIfPersonLikedYou(id, req.headers)

        // If match -> Insert into database

        if(result.status == 200) {
            var matchInserted = await db.insertMatch(id, req.headers)
        }

        // Send message back to client

        context.res = {
            body: {
                status: 'Success', matchInserted
            }
        };
    } catch(error) {
        context.res = {
            status: 400,
            body: error.message
        }
    }
}