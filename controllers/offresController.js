const { query } = require('express');
const Offre = require('../models/offre');
const pagination = require('pagination');
const sanitize = require("sanitize-filename");
const fs = require('fs');
const { error } = require('console');



// Générateur de pagination
const generateBoostrapPaginator = (req, currentPage, itemsPerPage, totalCount) => {
    return new pagination.TemplatePaginator({
        prelink: "/" + req.session.user.type_utilisateur, current: currentPage, rowsPerPage: itemsPerPage,
        totalResult: totalCount, slashSeparator: true,
        template: function (result) {
            prelink = result.prelink
            if (req.query.search || req.query.date_interval || req.query.typePoste || req.query.entreprise) {
                prelink = prelink + '?search=' + req.query.search + '&' + 'date_interval=' + req.query.date_interval + '&' + 'typePoste=' + req.query.typePoste + '&' + 'entreprise=' + req.query.entreprise + '&'
            }
            else prelink = prelink + '?'
            var html = '<div><ul class="pagination">';
            if (result.pageCount < 2) {
                html += '</ul></div>';
                return html;
            }
            if (result.previous) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + 'page=' + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
            }
            if (result.range.length) {
                for (i = 0, len = result.range.length; i < len; i++) {
                    if (result.range[i] === result.current) {
                        html += '<li class="active page-item"><a class="page-link" href="' + prelink + 'page=' + result.range[i] + '">' + result.range[i] + '</a></li>';
                    } else {
                        html += '<li class="page-item"><a class="page-link" href="' + prelink + 'page=' + result.range[i] + '">' + result.range[i] + '</a></li>';
                    }
                }
            }
            if (result.next) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + 'page=' + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
            }
            html += '</ul></div>';
            return html;
        }
    });
};


const offresController = {
    getOffres: (req, res) => {

        // Préparation de la pagination
        const itemsPerPage = 5;
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * itemsPerPage;

        // Si l'utilisateur éffectue une recherche
        if (req.query.search || req.query.date_interval || req.query.typePoste || req.query.entreprise) {
            Offre.search(req.session.user.organisation,req.query, itemsPerPage, offset, (err, results, totalCount) => {
                if (err) {
                    console.error('Error fetching offres: ', err);
                    res.redirect('/');
                } else {
                    const boostrapPaginator = generateBoostrapPaginator(req, currentPage, itemsPerPage, totalCount);
                    console.log(results)
                    res.render(req.session.user.type_utilisateur + '/dashboard', {
                        title: 'Accueil',
                        offres: results,
                        user: req.session.user,
                        paginator: boostrapPaginator.render(),
                    });
                }
            }
            )
        } else {
                Offre.readWithLimit(req.session.user.organisation,itemsPerPage, offset, (err, results, totalCount) => {
                    if (err) {
                        throw new Error('Error fetching offres: ', err);
                    } else {
                        const boostrapPaginator = generateBoostrapPaginator(req, currentPage, itemsPerPage, totalCount);
                        res.render(req.session.user.type_utilisateur + '/dashboard', {
                            title: 'Accueil',
                            offres: results,
                            user: req.session.user,
                            paginator: boostrapPaginator.render(),
                        });
                    }
                }
                )
            
            
        }
    },
    voirOffre: (req, res) => {
        /* Contrôle d'accès */
        if(req.session.user.type_utilisateur == 'recruteur'){
            let offre_ids = []
            const promise = Offre.getOffreIdByOrg(req.session.user.organisation)
            .then((results) => {
                results.forEach((result)=>{
                    offre_ids.push(result.num_offre)
                })
                if(!offre_ids.includes(parseInt(req.params.id)  )){
                    res.send('Vous n\'êtes pas autorisé à consulter cette offre')
                }
                
            })
        }
        /* Fin contrôle d'accès */
        Offre.read(req.params.id, (err, result) => {
            if (err) {
                throw new Error(err)
            }
            else {
                res.render(req.session.user.type_utilisateur + '/voirOffre', 
                { title: 'Offre', user: req.session.user, result: result });
            }
        })
    },
    showCandidaterOffre: (req, res) => {
        Offre.read(req.params.id, (err, result) => {
            if (err) {
                throw new Error(err)
            }
            else {
                if (req.session.uploaded_files == undefined) {
                    console.log('Init uploaded files array');
                    req.session.uploaded_files = [];
                }

                res.render('candidat/candidaterOffre', { title: 'Offre', files_array: req.session.uploaded_files, user: req.session.user, result: result });
            }
        })
    },
    showAddOffre: (req, res) => {
        res.render('recruteur/ajouterOffre', { title: 'Ajout offre', user: req.session.user });
    },
    addOffre: (req, res) => {

        // L'idéal serait de valider les inputs comme dans le controllers auth avec Joi, mais par manque de temps on le fait pas ici...
        const Fiche_poste = {
            organisation: req.session.user.organisation,
            intitule: req.body.intitule,
            date_ajout: new Date(),
            responsable: req.body.responsable,
            type_metier: req.body.typeMetier,
            rythme: req.body.rythme,
            fourchette_min: req.body.fourchetteMin,
            fourchette_max: req.body.fourchetteMax,
            description: req.body.description
        }
        const offre = {
            organisation: req.session.user.organisation,
            date_validite: req.body.date_validite,
            etat: req.body.etat,
            pcs_demandees: req.body.pcsDemandees
        }

        const promise = Offre.createFichePoste(Fiche_poste)
            .then((results) => {
                offre.fiche_poste = results.insertId;
                const promise2 = Offre.createOffre(offre)
                    .then(() => {
                        res.render('partials/loading', { title: 'Accueil', message: 'L\'offre a été ajouté ! Vous allez être redirigé vers l\'accueil.' });
                    })
                    .catch((error) => {
                        throw new Error(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })




    },
    upload: (req, res) => {
        const uploaded_file = req.file

        if (!uploaded_file) {
            res.render('candidat/candidaterOffre', { title: 'Postuler', user: req.session.user, files_array: req.session.uploaded_files, upload_error: 'Merci de sélectionner le fichier à charger !' });
        } else {
            req.session.uploaded_files.push(uploaded_file.filename);
            res.redirect('../postuler')
        }

    },
    getfile: (req, res) => {
        try {
            /* Éviter injection */
            var filename = sanitize(req.query.fichier_cible);
            /* ---------------- */
            res.download('./mesfichiers/' + filename);
        } catch (error) {
            res.send('Une erreur est survenue lors du téléchargement de ' + filename + ' : ' + error);
        }
    },
    deletefile: (req, res) => {
        fs.unlink('./mesfichiers/' + req.query.fichier_supp, (err) => {
            if (err) {
                res.render('candidat/candidaterOffre', { title: 'Postuler', user: req.session.user, files_array: req.session.uploaded_files, upload_error: 'Une erreur est survenue lors de la suppression' });
            } else {
                const index = req.session.uploaded_files.indexOf(req.query.fichier_supp)
                req.session.uploaded_files.splice(index, 1)
                res.redirect('../postuler');
            }
        });



    },
    candidaterOffre: (req, res) => {
        const pathFiles = req.session.uploaded_files.join(',')

        const data_candidature = {
            dateCandidature: new Date(),
            statut: 'en attente de traitement',
            utilisateur: req.session.user.id,
            offre: req.params.id,
            pathFiles: pathFiles
        }
        const promise = Offre.candidaterOffre(data_candidature)
            .then((results) => {
                if (results == 'Déjà candidaté') {
                    res.render('candidat/candidaterOffre', { title: 'Postuler', user: req.session.user, files_array: req.session.uploaded_files, upload_error: 'Vous avez déjà postuler à cette offre (voir vos candidatures)' });
                } else {
                    res.render('partials/loading', { title: 'Postuler', message: 'Votre candidature a été prise en compte ! À bientôt' })

                }

            })
            .catch((error) => {
                console.log(error)
            })

    },
    showEditOffre: (req, res) => {
        Offre.read(req.params.id,(err,results)=>{
            if(err) throw new Error(err)
            else{
                res.render(req.session.user.type_utilisateur+'/editOffre',{title :'Edit offre', user: req.session.user, result : results})
            }
        })
        
    },
    editOffre: (req, res) => {

        const data = {
            intitule: req.body.intitule,
            responsable: req.body.responsable,
            type_metier: req.body.typeMetier,
            rythme: req.body.rythme,
            fourchette_min: req.body.fourchetteMin,
            fourchette_max: req.body.fourchetteMax,
            description: req.body.description,
            date_validite: req.body.date_validite,
            etat: req.body.etat,
            pcs_demandees: req.body.pcsDemandees
        }
       

        const promise = Offre.updateOffre(req.params.id,req.body.fichePoste_id,data)
            .then((results) => {
                res.render('partials/loading',{title: 'Update offre',user: req.session.user, message: 'Votre offre a été mis à jour !'})
                
            })
            .catch((error) => {
                console.log(error)
            })

    },
    deleteOffre: (req, res) =>{
        const num_offre = parseInt(req.params.id)
        const fichePoste = parseInt(req.query.fichePoste)
        const promise = Offre.deleteOffre(num_offre,fichePoste)
        .then((results)=> {
            res.render('partials/loading',{title: 'Delete offre',user: req.session.user, message: 'Votre offre a été supprimé !'})
        })
        .catch((error)=>{
            console.log(error)
        })

    },
    getCandidaturesOffre: (req, res) => {
        const promise = Offre.readCandidaturesOffre(req.params.id)
            .then((results) => {
                
                res.render('recruteur/candidaturesOffre',{title:'Candidatures',user: req.session.user,candidatures : results})
                
            })
            .catch((error) => {
                console.log(error)
            })

    },
    acceptCandidature: (req,res) =>{
        const promise = Offre.acceptCandidature(parseInt(req.query.id_c),parseInt(req.query.id_u))
        .then((results)=>{
            res.redirect('./')
        })
        .catch((error)=>{
            console.log(error)
        })
    }
}


module.exports = offresController;