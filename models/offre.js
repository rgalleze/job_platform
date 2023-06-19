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
    search: (org, query, itemsPerPage, offset, callback) => {
        if (!org) org = ''
        let countQuery = `SELECT COUNT(*) as total FROM Fiche_poste inner join Organisation on Fiche_poste.organisation = Organisation.siren
                            WHERE Fiche_poste.intitule LIKE ? 
                            AND date_ajout >= NOW() - INTERVAL ? DAY
                            AND rythme LIKE ?
                            AND Organisation.nom LIKE ?
                            AND organisation LIKE ?
                            `

        let query1 = `(SELECT * FROM Fiche_poste inner join Organisation on Fiche_poste.organisation = Organisation.siren
            WHERE Fiche_poste.intitule LIKE ? 
            AND date_ajout >= NOW() - INTERVAL ? DAY
            AND rythme LIKE ?
            AND Organisation.nom LIKE ?
            AND organisation LIKE ?
            )`

        let query2 = countQuery + `; SELECT * FROM Offre INNER JOIN ` + query1 + ` AS FP ON Offre.fiche_poste = FP.id  LIMIT ? OFFSET ? `
        let date_interval = 1900
        if (query.date_interval != '') date_interval = parseInt(query.date_interval)
        const searchq = '%' + query.search + '%'
        const typePoste = '%' + query.typePoste + '%'
        const entreprise = '%' + query.entreprise + '%'
        db.query(query2,
            [searchq, date_interval, typePoste, entreprise, '%' + org + '%', searchq, date_interval, typePoste, entreprise, '%' + org + '%', itemsPerPage, offset],
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
                //console.log(results)
                return callback(null, results[1], totalCount);
            }
        )
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
    readWithLimit: (org, itemsPerPage, offset, callback) => {
        if (!org) org = ''
        db.query(
            `SELECT COUNT(*) as total FROM Fiche_poste where organisation like ? ;
            SELECT * FROM Offre 
            inner join Fiche_poste on Offre.fiche_poste = Fiche_poste.id  
            inner join Organisation on Organisation.siren = Offre.organisation
            where Offre.organisation like ? 
            LIMIT ? OFFSET ?`,
            ['%' + org + '%', '%' + org + '%', itemsPerPage, offset],
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
                return callback(null, results[1], totalCount);
            }
        )
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
    },
    candidaterOffre: (data) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * from Dossier_candidature Where offre = ? and utilisateur = ?', [data.offre, data.utilisateur],
                (error, results) => {
                    console.log(results)
                    if (results.length != 0) {
                        console.log(results)
                        resolve('Déjà candidaté')
                    }
                    else {
                        db.query('INSERT INTO Dossier_candidature SET ?', data,
                            (error, results) => {
                                if (error) reject(error);
                                else resolve(results)
                            })
                    }
                })

        });
    },
    updateOffre: (offre,fichePoste, data) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE Fiche_poste 
            SET intitule = ?, 
            responsable = ?, 
            type_metier = ?,
            rythme = ?,
            fourchette_min = ?,
            fourchette_max = ?,
            description = ?
            WHERE id = ?;UPDATE Offre SET date_validite = ?, etat = ?, pcs_demandees = ? WHERE Offre.num_offre = ?; `,
                [data.intitule, data.responsable, data.type_metier, data.rythme, data.fourchette_min, data.fourchette_max,
                    data.description, fichePoste,data.date_validite, data.etat, data.pcs_demandees, offre], (error, results) => {
                    if (error) reject(error);
                    else resolve(results)
                })
        })
    },
    readCandidaturesOffre: (offre) =>{
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM Dossier_candidature as d inner join Utilisateur as u on d.utilisateur=u.id  where offre = ? ', offre, (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })
        })

    }
    




}

module.exports = Offre;