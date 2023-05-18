const db = require("./db.js");


const user = {
create: (data, callback) => {
    db.query(
        'INSERT INTO Utilisateur SET ?',
        data,
        (error, results) => {
            if (error) throw error;
            return callback(null, results);
        }
    );
},

read: (email, callback) => {
    db.query(
        'SELECT * FROM Utilisateur WHERE email = ?',
        [email],
        (error, results) => {
            if (error) throw error;
            return callback(null, results[0]);
        }
    );
},
readAll: (callback) => {
    db.query(
        'SELECT * FROM Utilisateur',
        (error, results) => {
            if (error) throw error;
            return callback(null, results);
        }
    );
},


}

module.exports = user;