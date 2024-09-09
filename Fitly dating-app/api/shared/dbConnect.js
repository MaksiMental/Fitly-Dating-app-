const { Connection, Request, TYPES } = require('tedious');
const config = require('./config.json');
const connection = new Connection(config)
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const sorting = require('./mergeSort.js');


// Json web token
function generateAuthToken(id, email, first_name, last_name, age, gender, favorite_activity, notification, picture_url, is_admin, preferred_gender, preferred_age_start, preferred_age_end) {
    const token = jwt.sign(
      {
        id: id,
        email: email,
        first_name: first_name,
        last_name: last_name,
        age: age,
        gender: gender,
        favorite_activity: favorite_activity,
        notification: notification,
        picture_url: picture_url,
        is_admin: is_admin,
        preferred_gender: preferred_gender,
        preferred_age_start: preferred_age_start,
        preferred_age_end: preferred_age_end
      },
      'vores_hemmelige_nøgle',
      { expiresIn: "1d" }
    );
    return token;
};

function startDB() {
    return new Promise((resolve, reject) => {
        connection.on('connect', (err) => {
            if(err) {
                console.log("Connection failed")
                reject(err);
                throw err;
            } else {
                console.log("Connected")
                resolve();
            }
        })
        connection.connect();
    })
}

module.exports.sqlConnection = connection;
module.exports.startDB = startDB;

//#########################################################################
// Users

// Insert user
function insert(payload) {
    return new Promise((resolve, reject) => {

        const sql = `INSERT INTO dbo.users (email, hashed_password, first_name, last_name, age, gender, favorite_activity, preferred_gender, preferred_age_start, preferred_age_end) VALUES (@email, @hashed_password, @first_name , @last_name, @age, @gender, @favorite_activity, @preferred_gender, @preferred_age_start, @preferred_age_end)`
        const request = new Request(sql, (err) => {
            if(err) {
                reject(err)
                console.log(err)
            }
        });

        // Hash password
        let password = payload.password
        var hashedPassword = passwordHash.generate(password);

        request.addParameter('email', TYPES.VarChar, payload.email)
        request.addParameter('hashed_password', TYPES.VarChar, hashedPassword)
        request.addParameter('first_name', TYPES.VarChar, payload.first_name)
        request.addParameter('last_name', TYPES.VarChar, payload.last_name)
        request.addParameter('age', TYPES.Int, payload.age)
        request.addParameter('gender', TYPES.VarChar, payload.gender)
        request.addParameter('favorite_activity', TYPES.VarChar, payload.favorite_activity)
        request.addParameter('preferred_gender', TYPES.VarChar, payload.preferred_gender)
        request.addParameter('preferred_age_start', TYPES.Int, payload.preferred_age_start)
        request.addParameter('preferred_age_end', TYPES.Int, payload.preferred_age_end)

        request.on('requestCompleted', (row) => {
        console.log("User inserted", row);
        resolve('User inserted', row);
        })
        
        connection.execSql(request);    
    })
    
}

module.exports.insert = insert;

// Select user
function select(id) {
    return new Promise((resolve, reject) => {

        const sql = `SELECT * FROM dbo.users WHERE id = @id`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'User does not exist' })
            }
        })
        request.addParameter('id', TYPES.Int, id);

        request.on('row', (columns) => {
            resolve(columns);
        })
        connection.execSql(request);

    })
}

module.exports.select = select;

// Update user
function update(payload, header) {
    return new Promise((resolve, reject) => {

        // Check if logged in
        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        if (!token) {
            reject({ message: 'Please provide a token'})
        } else if(decoded.email !== payload.email) {
            reject({ message: 'Not your account'})
        }

        // Else execute
        const sql = `UPDATE dbo.users SET email = @email, hashed_password = @hashed_password, favorite_activity = @favorite_activity, picture_url = @picture_url, preferred_gender = @preferred_gender, preferred_age_start = @preferred_age_start, preferred_age_end = @preferred_age_end WHERE email = @email`
        const request = new Request(sql, (err) => {
            if(err) {
                reject(err)
                console.log(err)
            }
        });
        
        // Hash password
        let password = payload.password
        var hashedPassword = passwordHash.generate(password);

        request.addParameter('email', TYPES.VarChar, payload.email)
        request.addParameter('hashed_password', TYPES.VarChar, hashedPassword)
        request.addParameter('favorite_activity', TYPES.VarChar, payload.favorite_activity)
        request.addParameter('picture_url', TYPES.VarChar, payload.picture_url)
        request.addParameter('preferred_gender', TYPES.VarChar, payload.preferred_gender)
        request.addParameter('preferred_age_start', TYPES.Int, payload.preferred_age_start)
        request.addParameter('preferred_age_end', TYPES.Int, payload.preferred_age_end)

        request.on('requestCompleted', (row) => {
        console.log("User updated", row);
        resolve('User updated', row);
        })
        connection.execSql(request);
    })
    
}

module.exports.update = update;

// Delete user
function deleteUser(header) {
    return new Promise((resolve, reject) => {

        // Check if logged in
        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        const sql = `DELETE FROM dbo.users WHERE id = @id;`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'User does not exist' })
            }
        })
        request.addParameter('id', TYPES.Int, decoded.id);
        
        // Message back to client - when completed request
        request.on('requestCompleted', (row) => {
            console.log("User deleted", row);
            resolve('User deleted', row);
        })

        connection.execSql(request);

    })
}

module.exports.deleteUser = deleteUser;

// Tilføj match

function insertMatch(id, header) {
    return new Promise((resolve, reject) => {

        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        const sql = `INSERT INTO dbo.matches (person1, person2) VALUES (@person1, @person2)`
        const request = new Request(sql, (err) => {
            if(err) {
                reject(err)
                console.log(err)
            }
        });

        request.addParameter('person1', TYPES.Int, decoded.id)
        request.addParameter('person2', TYPES.Int, id)

        request.on('requestCompleted', (row) => {
            resolve('Match inserted', row);
        })
        
        connection.execSql(request);    
    })
    
}

module.exports.insertMatch = insertMatch;

// Se matches
function seeUserMatches(header) {
    return new Promise((resolve, reject) => {

         // Check if logged in as user
         let token = header.xauthtoken;
         const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');
 
         if (!token) {
             reject({ message: 'Please provide a token'})
         } else if(!decoded.email) {
            reject({ message: 'Your not logged in properly, please try again'})
         }

        const sql = `SELECT match_id, CONCAT(u.first_name, ' ', u.last_name) AS person1, CONCAT(u2.first_name, ' ', u2.last_name) AS person2, date FROM dbo.matches m JOIN users u ON m.person1 = u.id JOIN users u2 ON m.person2 = u2.id WHERE m.person1 = @id OR m.person2 = @id`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'You have no matches' })
            }
        })

        request.addParameter('id', TYPES.VarChar, decoded.id)

        var response = {};
        var counter = 1;
        request.on('row', (columns) => {
            response[counter] = {}
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value;
            })
            counter += 1;
        })
        request.on('requestCompleted', function() {
            resolve(response);
        })
        connection.execSql(request);
    })
}

module.exports.seeUserMatches = seeUserMatches;

// Delete user match
function deleteUserMatch(id, header) {
    return new Promise((resolve, reject) => {

        // Check if logged in as user
        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        if (!token) {
            reject({ message: 'Please provide a token'})
        } else if(!decoded.email) {
            reject({ message: 'Your not logged in properly, please try again'})
        }
   
        const sql = `DELETE FROM dbo.matches WHERE match_id = @match_id`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'User does not exist' })
            }
        })
        request.addParameter('match_id', TYPES.Int, id);

        // Message back to client - when completed request
        request.on('requestCompleted', (row) => {
            console.log("User deleted", row);
            resolve('User deleted', row);
        })

        connection.execSql(request);

    })
}

module.exports.deleteUserMatch = deleteUserMatch;

// Like en person / check hvis han har liket dig = match

function checkIfPersonLikedYou(id, header) {

    return new Promise((resolve, reject) => {
        // Check if logged in
        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        if (!token) {
            reject({ message: 'Please provide a token'})
        }

        const sql = `SELECT * FROM likes WHERE requester = @recipient AND recipient = @requester`

        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err)
            } else if(rowcount !== 0) {
                resolve({ message: 'Du har lige matchet med personen!', status: 200 })
            } else {
                resolve({ message: 'Du har ikke matchet med denne person endnu' })
            }
        });

        request.addParameter('requester', TYPES.Int, decoded.id)
        request.addParameter('recipient', TYPES.Int, id)

        connection.execSql(request);
    })

}

module.exports.checkIfPersonLikedYou = checkIfPersonLikedYou;

function likeUser(id, header) {
    return new Promise((resolve, reject) => {

        // Check if logged in
        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        if (!token) {
            reject({ message: 'Please provide a token'})
        }

        // Check if recommended match already liked currently logged in user
        const sql = `INSERT INTO dbo.likes(requester, recipient) VALUES (@requester, @recipient)`
        const request = new Request(sql, (err) => {
            if(err) {
                reject(err)
                console.log(err)
            }
        });

        request.addParameter('requester', TYPES.Int, decoded.id)
        request.addParameter('recipient', TYPES.Int, id)

        request.on('requestCompleted', (row) => {
            console.log("User liked", row);
            resolve('User liked', row);
        })
        connection.execSql(request);
    })
    
}

module.exports.likeUser = likeUser;

// Dislike en person

function dislikeUser(id, header) {
    return new Promise((resolve, reject) => {

        // Check if logged in
        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        if (!token) {
            reject({ message: 'Please provide a token'})
        }

        // Else execute
        const sql = `INSERT INTO dbo.dislikes(requester, recipient) VALUES (@requester, @recipient)`
        const request = new Request(sql, (err) => {
            if(err) {
                reject(err)
                console.log(err)
            }
        });

        request.addParameter('requester', TYPES.Int, decoded.id)
        request.addParameter('recipient', TYPES.Int, id)

        request.on('requestCompleted', (row) => {
            console.log("User liked", row);
            resolve('User liked', row);
        })
        connection.execSql(request);
    })
    
}

module.exports.dislikeUser = dislikeUser;

//#########################################################################
// Authentication

function login(payload, header) {
    return new Promise((resolve, reject) => {

        // Check if logged in
        if(header.xauthtoken) {
            const decoded = jwt.verify(header.xauthtoken, 'vores_hemmelige_nøgle');
            if (decoded)
                resolve({ message: 'Your are already logged in!', status: 200 })
        }  

        const sql = `SELECT * FROM dbo.users WHERE email = @email`

        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'Wrong email' })
            }
        })
        request.addParameter('email', TYPES.VarChar, payload.email)

        request.on('row', (columns) => {
            // Generate JWT token
            let token = generateAuthToken(
                columns[0].value, columns[1].value, columns[3].value, columns[4].value, columns[5].value, columns[6].value, columns[7].value, columns[8].value, columns[9].value, columns[10].value, columns[11].value, columns[12].value, columns[13].value
            );
        
            // Hash password the client have send throug HTTP request
            let password = payload.password

            // Password stored in database
            let hashedPassword = columns[2].value;

            //verify if password is equal to hashedpassword
            if(passwordHash.verify(password, hashedPassword)) {
                request.addParameter('hashed_password', TYPES.VarChar, hashedPassword)
                resolve({ message: 'Logged in', token: token })
            } else {
                reject({ message: 'Wrong password'})
            }
        })
        connection.execSql(request);
    })
}
module.exports.login = login;

//#########################################################################
// Auth

function auth(header) {
    return new Promise((resolve, reject) => {
        let token = header.xauthtoken;
        // Decode current token
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');
        
        // no need to verify token again
        // also no need to query a database, we have all the info we need from the token
        if (!token) {
            reject({ message: 'Please provide a token'})
        } else if (decoded.is_admin == 1) {
            resolve({ message: 'Admin access granted' })
        } else if(decoded.is_admin == 0) {
            reject({ message: 'Not an admin'})
        }
    })
}

module.exports.auth = auth;

// Update every user (admin)
function updateAdmin(payload, header) {
    return new Promise((resolve, reject) => {

        // Check if admin
        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        console.log(decoded);

        if (!token) {
            reject({ message: 'Please provide a token'})
        } else if (decoded.is_admin !== 1) {
            reject({ message: 'Your not authorized for that action' })
        }

        // Else execute
        const sql = `UPDATE dbo.users SET email = @email, hashed_password = @hashed_password, favorite_activity = @favorite_activity, picture_url = @picture_url, preferred_gender = @preferred_gender, preferred_age_start = @preferred_age_start, preferred_age_end = @preferred_age_end WHERE id = @id`
        const request = new Request(sql, (err) => {
            if(err) {
                reject(err)
                console.log(err)
            }
        });
        
        // Hash password
        let password = payload.password
        var hashedPassword = passwordHash.generate(password);

        request.addParameter('id', TYPES.Int, payload.id)
        request.addParameter('email', TYPES.VarChar, payload.email)
        request.addParameter('hashed_password', TYPES.VarChar, hashedPassword)
        request.addParameter('favorite_activity', TYPES.VarChar, payload.favorite_activity)
        request.addParameter('picture_url', TYPES.VarChar, payload.picture_url)
        request.addParameter('preferred_gender', TYPES.VarChar, payload.preferred_gender)
        request.addParameter('preferred_age_start', TYPES.Int, payload.preferred_age_start)
        request.addParameter('preferred_age_end', TYPES.Int, payload.preferred_age_end)

        request.on('requestCompleted', (row) => {
            console.log("User updated", row);
            resolve({ message: 'User updated' });
        })
        connection.execSql(request);
    })
    
}

module.exports.updateAdmin = updateAdmin;

// Delete Admin user
function deleteAdmin(id, header) {
    return new Promise((resolve, reject) => {

        // Check if admin
        let token = header.xauthtoken;
        const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');

        if (!token) {
            reject({ message: 'Please provide a token'})
        } else if (decoded.is_admin !== 1) {
            reject({ message: 'Your not authorized for that action' })
        }

        const sql = `DELETE FROM dbo.users WHERE id = @id;`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'User does not exist' })
            }
        })
        request.addParameter('id', TYPES.Int, id);
        
        // Message back to client - when completed request
        request.on('requestCompleted', (row) => {
            console.log("User deleted", row);
            resolve('User deleted', row);
        })

        connection.execSql(request);

    })
}

module.exports.deleteAdmin = deleteAdmin;

// Se alle brugere i systemet (admin)
function selectAdmin(header) {
    return new Promise((resolve, reject) => {

         // Check if admin
         let token = header.xauthtoken;
         const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');
 
         if (!token) {
             reject({ message: 'Please provide a token'})
         } else if (decoded.is_admin !== 1) {
             reject({ message: 'Your not authorized for that action' })
         }

        const sql = `SELECT * FROM dbo.users`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'No users in database' })
            }
        })
        var response = {};
        var counter = 1;
        request.on('row', (columns) => {
            response[counter] = {}
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value;
            })
            counter += 1;
        })
        request.on('requestCompleted', function() {
            resolve(response);
        })
        connection.execSql(request);
    })
}

module.exports.selectAdmin = selectAdmin;

// Se alle matches i systemet (admin)
function selectMatchesAdmin(header) {
    return new Promise((resolve, reject) => {

         // Check if admin
         let token = header.xauthtoken;
         const decoded = jwt.verify(token, 'vores_hemmelige_nøgle');
 
         if (!token) {
             reject({ message: 'Please provide a token'})
         } else if (decoded.is_admin !== 1) {
             reject({ message: 'Your not authorized for that action' })
         }

         // ...

        const sql = `SELECT match_id, CONCAT(u.first_name, ' ', u.last_name) AS person1, CONCAT(u2.first_name, ' ', u2.last_name) AS person2, date FROM dbo.matches m JOIN users u ON m.person1 = u.id JOIN users u2 ON m.person2 = u2.id`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'No matches in database' })
            }
        })
        var response = {};
        var counter = 1;
        request.on('row', (columns) => {
            response[counter] = {}
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value;
            })
            counter += 1;
        })
        request.on('requestCompleted', function() {
            resolve(response);
        })
        connection.execSql(request);
    })
}

module.exports.selectMatchesAdmin = selectMatchesAdmin;

//#########################################################################
// Matching algoritme
function selectAllUsers(header) {
    return new Promise((resolve, reject) => {

         // Check if logged in
         const decoded = jwt.verify(header.xauthtoken, 'vores_hemmelige_nøgle');
         let validToken = decoded.id; // Check if token have payload with an id
 
         if (!validToken) {
             reject({ message: 'Please provide a token'})
         }

        const sql = `SELECT * FROM dbo.users WHERE id NOT IN (SELECT person1 FROM matches WHERE person1 = @id OR person2 = @id) AND id NOT IN (SELECT person2 FROM matches WHERE person1 = @id OR person2 = @id) AND id NOT IN (SELECT recipient FROM likes WHERE requester = @id) AND id NOT IN (SELECT recipient FROM dislikes WHERE requester = @id)`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount == 0) {
                reject({ message: 'No users in database' })
            }
        })
        request.addParameter('id', TYPES.Int, decoded.id);

        var response = [];
        var counter = 0;

        request.on('row', (columns) => {
            response[counter] = {}
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value;
            })
            counter += 1;
        })
        request.on('requestCompleted', function() {
            resolve(response);
        })
        
        connection.execSql(request);
    })
}

module.exports.selectAllUsers = selectAllUsers;

function sortAllUsers(users, header) {
    return new Promise((resolve, reject) => {

        // Payload of token (we have already checked if user is logged in)
        const decoded = jwt.verify(header.xauthtoken, 'vores_hemmelige_nøgle');

        // MATCHTING ALGORITHM

        // We filter all users and save them here
        let filteredArray = [];

        // pushing users to the filtered array
        for (let user of users) {
            if((user.gender == decoded.preferred_gender) && (user.age >= decoded.preferred_age_start) && (user.age <= decoded.preferred_age_end) && (user.favorite_activity == decoded.favorite_activity)) {
                filteredArray.push(user.id);
            }
        }
        
        let sortedArray = sorting.mergeSort(filteredArray);

        // SQL STATEMENT, RETURN RECOMMENDATIONS
        const sql = `SELECT * FROM dbo.users WHERE id IN (@id1, @id2, @id3)`
        const request = new Request(sql, (err, rowcount) => {
            if(err) {
                reject(err)
                console.log(err);
            } else if(rowcount < 3) {
                resolve({ message: 'Not enough users for matching', status: 204 })
            }
        })
        request.addParameter('id1', TYPES.Int, sortedArray[0])
        request.addParameter('id2', TYPES.Int, sortedArray[1])
        request.addParameter('id3', TYPES.Int, sortedArray[2])

        var response = [];
        var counter = 0;

        request.on('row', (columns) => {
            response[counter] = {}
            columns.forEach(function(column){
                response[counter][column.metadata.colName] = column.value;
            })
            counter += 1;
        })
        request.on('requestCompleted', function() {
            resolve(response);
        })
        
        connection.execSql(request);

    })
}

module.exports.sortAllUsers = sortAllUsers;