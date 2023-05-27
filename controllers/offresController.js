const Offre = require('../models/offre');
const pagination = require('pagination');
// on va utliser Multer comme middleware de gestion d'upload de fichier (faire au préalable : npm install multer)


const offresController = {

    getOffres: (req, res) => {

        // Nombre d'offres par page
        const itemsPerPage = 5;
        // Numero de page en cours
        const currentPage = parseInt(req.query.page) || 1;
        // Nombre d'offre à skip
        const offset = (currentPage - 1) * itemsPerPage;

        // On récupère le nombre d'offre pour mettre en place la pagination
        Offre.countOffres((err, result) => {
            const totalCount = result['COUNT(*)'];

            // On charge itemsPerPage offres selon la page courante
            Offre.readWithLimit(itemsPerPage, offset, (err, results) => {
                if (err) {
                    console.error('Error fetching offres: ', err);
                    res.redirect('/');
                } else {

                    // Juste un customization du paginator pour utiliser bootstrap


                    const boostrapPaginator = new pagination.TemplatePaginator({
                        prelink: "/" + req.session.user.type_utilisateur, current: currentPage, rowsPerPage: itemsPerPage,
                        totalResult: totalCount, slashSeparator: true,
                        template: function (result) {
                            var i, len, prelink = result.prelink;
                            var html = '<div><ul class="pagination">';
                            if (result.pageCount < 2) {
                                html += '</ul></div>';
                                return html;
                            }
                            if (result.previous) {
                                html += '<li class="page-item"><a class="page-link" href="' + prelink + '?page=' + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
                            }
                            if (result.range.length) {
                                for (i = 0, len = result.range.length; i < len; i++) {
                                    if (result.range[i] === result.current) {
                                        html += '<li class="active page-item"><a class="page-link" href="' + prelink + '?page=' + result.range[i] + '">' + result.range[i] + '</a></li>';
                                    } else {
                                        html += '<li class="page-item"><a class="page-link" href="' + prelink + '?page=' + result.range[i] + '">' + result.range[i] + '</a></li>';
                                    }
                                }
                            }
                            if (result.next) {
                                html += '<li class="page-item"><a class="page-link" href="' + prelink + '?page=' + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
                            }
                            html += '</ul></div>';
                            return html;
                        }
                    });

                    // On affiche le dashboard Candidat avec les offres à afficher 
                    res.render(req.session.user.type_utilisateur + '/dashboard', {
                        title: 'Accueil',
                        offres: results,
                        user: req.session.user,
                        paginator: boostrapPaginator.render(),
                    });
                }
            }

            )
        })
    },

    voirOffre: (req, res) => {
        Offre.read(req.params.id, (err, result) => {
            if (err) {
                console.error(err);
                res.redirect('/');
            }
            else {
                console.log(result)
                res.render(req.session.user.type_utilisateur + '/voirOffre', { title: 'Offre', user: req.session.user, result: result });
            }

        })


    },
    showCandidaterOffre: (req, res) => {
        Offre.read(req.params.id, (err, result) => {
            if (err) {
                console.error(err);
                res.redirect('/');
            }
            else {
                console.log(result)
                if (req.session.uploaded_files == undefined) {
                    console.log('Init uploaded files array');
                    req.session.uploaded_files = [];
                }

                res.render('candidat/candidaterOffre', { title: 'Offre', files_array: req.session.uploaded_files, user: req.session.user, result: result });
            }

        })


    },
    candidaterOffre: (req, res) => {
        const uploaded_file = req.file
        Offre.read(req.params.id, (err, result) => {
            if (err) {
                console.error(err);
                res.redirect('/');
            }
            else {
                if (!uploaded_file) {
                    res.render('candidat/candidaterOffre', { result: result,title: 'Offre', user: req.session.user, files_array: req.session.uploaded_files, upload_error: 'Merci de sélectionner le fichier à charger !' });
                } else {
                    console.log(uploaded_file.originalname, ' => ', uploaded_file.filename);
                    req.session.uploaded_files.push(uploaded_file.filename);
                    res.render('candidat/candidaterOffre', { result: result,title: 'Offre', user: req.session.user, files_array: req.session.uploaded_files, uploaded_filename: uploaded_file.filename, uploaded_original: uploaded_file.originalname });
                }
            }


        })
    }
    ,
    showAddOffre: (req, res) => {
        res.render('recruteur/ajouterOffre', { title: 'Ajout offre', user: req.session.user });
    },
    addOffre: (req, res) => {
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

        Offre.createOffre(Fiche_poste, offre, (req, res) => {
            res.send("ajoute")
        })

    },


}


module.exports = offresController;