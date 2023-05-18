const db = require("./db");


const Offre = {
    read: (id, callback) => {
        db.query(
            "SELECT * FROM Offre,Organisation,Fiche_poste \
            WHERE Offre.organisation = Organisation.siren and Organisation.siren = Fiche_poste.organisation and Offre.num_offre = ?",
            [id],
            (error, results, fields) => {
                if (error) throw error;
                results = results.map(function (result) {
                    const data = Object.entries(result);
                    const offre = Object.fromEntries(data.slice(0, 6));
                    const organisation = Object.fromEntries(data.slice(6, 13));
                    const fichePoste = Object.fromEntries(data.slice(13));
                    return { offre: offre, organisation: organisation, fichePoste: fichePoste }
                })
                return callback(null, results[0]);
            }
        );
    },
    search: (query, callback) => {
        db.query(
            "SELECT * FROM Offre,Organisation,Fiche_poste WHERE Offre.organisation = Organisation.siren and Organisation.siren = Fiche_poste.organisation AND Fiche_poste.intitule LIKE ?",
            ['%' + query + '%'],
            (error, results, fields) => {
                if (error) throw error;
                return callback(null, results);
            }
        );
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
    readWithLimit: (itemsPerPage, offset,callback) => {
        db.query(
            "SELECT * FROM Offre,Organisation,Fiche_poste \
            WHERE Offre.organisation = Organisation.siren and Organisation.siren = Fiche_poste.organisation LIMIT ? OFFSET ?",
            [itemsPerPage, offset],
            (error, results) => {
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
    countOffres : ( callback) => {
        db.query(
            'SELECT COUNT(*) FROM Offre',
            (error, results) => {
                if (error) throw error;
                return callback(null, results[0]);
            }
        );
    },


}

module.exports = Offre;