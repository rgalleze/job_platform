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
readCandidatures: (user_id) => {
    return new Promise((resolve, reject) => {
        db.query('Select * from Dossier_candidature where utilisateur = ? ',user_id,
            (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })

    });
},
deleteCandidature: (id) =>{
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM Dossier_candidature WHERE Dossier_candidature.id = ? ',id,
            (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })

    });
}
}

module.exports = user;