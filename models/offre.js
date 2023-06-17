const db = require("./db");


const Offre = {
    read: (id, callback) => {
        db.query(
            "SELECT * FROM Offre inner join Fiche_poste on Offre.fiche_poste = Fiche_poste.id  inner join Organisation on Organisation.siren = Offre.organisation where Offre.num_offre= ?",
            [id],
            (error, results) => {
                if (error) throw error;
                results = results.map(function (result) {
                    const data = Object.entries(result);
                    const offre = Object.fromEntries(data.slice(0, 6));
                    const fichePoste = Object.fromEntries(data.slice(6, 15));
                    const organisation = Object.fromEntries(data.slice(15));
                    return { offre: offre, organisation: organisation, fichePoste: fichePoste }
                })
                callback(null, results[0]);
            }
        );
    },
    search: (query,itemsPerPage, offset, callback) => {
        db.query(
            `SELECT COUNT(*) as total 
            FROM Fiche_poste 
            WHERE Fiche_poste.intitule 
            LIKE ?;
            SELECT *
            FROM Offre
            INNER JOIN (
                SELECT *
                FROM Fiche_poste
                WHERE Fiche_poste.intitule LIKE ?
            )   AS FP ON Offre.fiche_poste = FP.id
            INNER JOIN Organisation ON Organisation.siren = Offre.organisation
            LIMIT ? OFFSET ?;`,
            ['%'+query+'%','%'+query+'%',itemsPerPage, offset],
            (error, results) => {
                if (error) throw error;
                const totalCount = results[0][0].total;
                results[1] = results[1].map(function (result) {
                    const data = Object.entries(result);
                    const offre = Object.fromEntries(data.slice(0, 6));
                    const fichePoste = Object.fromEntries(data.slice(6, 15));
                    const organisation = Object.fromEntries(data.slice(15));
                    return { offre: offre, organisation: organisation, fichePoste: fichePoste }
                })
                return callback(null, results[1],totalCount);
            }
        )
    },
    filter: (query, callback) => {
        db.query(
            'SELECT * FROM Offre WHERE date_ajout >= NOW() - INTERVAL ? DAY ',
            query,
            (error, results, fields) => {
                if (error) throw error;
                return callback(null, results);
            }
        );
    },
    readAll: (callback) => {
        db.query(
            "SELECT * FROM Offre,Organisation,Fiche_poste \
            WHERE Offre.organisation = Organisation.siren and Organisation.siren = Fiche_poste.organisation",
            [],
            (error, results, fields) => {
                if (error) throw error;
                // L'idée c'est d'avoir chaque élément de results sous la forme suivante :
                // {
                // offre: {num_offre: , organisation: , date_validite: , etat: , fiche_poste: ,pcs_demandees: },
                // organisation: { siren: ,nom: ,rue: ,ville: ,region: ,code_postal: ,pays:},
                // fichePoste: {id: ,date_ajout:, intitule: ,responsable: ,type_metier: ,rythme: ,fourchette_min: ,fourchette_max: ,description: }
                // }
                results = results.map(function (result) {
                    const data = Object.entries(result);
                    const offre = Object.fromEntries(data.slice(0, 6));
                    const organisation = Object.fromEntries(data.slice(6, 13));
                    const fichePoste = Object.fromEntries(data.slice(13));
                    return { offre: offre, organisation: organisation, fichePoste: fichePoste }
                })
                return callback(null, results);
            }
        )
    },
    readWithLimit: (itemsPerPage, offset, callback) => {
        db.query(
            `SELECT COUNT(*) as total FROM Fiche_poste;
            SELECT * FROM Offre 
            inner join Fiche_poste on Offre.fiche_poste = Fiche_poste.id  
            inner join Organisation on Organisation.siren = Offre.organisation 
            LIMIT ? OFFSET ?`,
            [itemsPerPage, offset],
            (error, results) => {
                if (error) throw error;
                // L'idée c'est d'avoir chaque élément de results sous la forme suivante :
                // {
                // offre: {num_offre: , organisation: , date_validite: , etat: , fiche_poste: ,pcs_demandees: },
                // organisation: { siren: ,nom: ,rue: ,ville: ,region: ,code_postal: ,pays:},
                // fichePoste: {id: ,date_ajout:, intitule: ,responsable: ,type_metier: ,rythme: ,fourchette_min: ,fourchette_max: ,description: }
                // }
                const totalCount = results[0][0].total;
                results[1] = results[1].map(function (result) {
                    const data = Object.entries(result);
                    const offre = Object.fromEntries(data.slice(0, 6));
                    const fichePoste = Object.fromEntries(data.slice(6, 15));
                    const organisation = Object.fromEntries(data.slice(15));
                    return { offre: offre, organisation: organisation, fichePoste: fichePoste }
                })
                return callback(null, results[1],totalCount);
            }
        )
    },
    countOffres: (callback) => {
        db.query(
            'SELECT COUNT(*) FROM Offre',
            (error, results) => {
                if (error) throw error;
                return callback(null, results[0]);
            }
        );
    },
    createFichePoste: (fichePoste) => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO Fiche_poste SET ?', fichePoste,
                (error, results) => {
                    if (error) reject(error);
                    else resolve(results)
                })

        });
    },
    createOffre: (offre) => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO Offre SET ?', offre, (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })


        })
    }





}

module.exports = Offre;