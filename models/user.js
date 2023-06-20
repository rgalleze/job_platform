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
},
updateRec: (data) =>{
    return new Promise((resolve, reject) => {
        db.query('Insert Into Demande_recruteur SET  ? ',data,
            (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })

    });
},
readDemandesRec: (org) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM `Demande_recruteur` as d inner join Utilisateur as u on d.utilisateur = u.id where d.organisation = ? and d.statut='non traite' ",org,
            (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })

    });
},
acceptRec: (id,org) =>{
    return new Promise((resolve, reject) => {
        db.query("UPDATE `Demande_recruteur` SET statut = 'accepte' WHERE utilisateur = ?;UPDATE Utilisateur SET type_utilisateur = 'recruteur', organisation = ? WHERE id = ? ",
        [id,org,id],
            (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })
    });
},
refuseRec: (id,org) =>{
    return new Promise((resolve, reject) => {
        db.query("UPDATE `Demande_recruteur` SET statut = 'refuse' WHERE utilisateur = ?; ",
        [id],
            (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })
    });
}
}

module.exports = user;