const Offre = require('../models/offre');
const pagination = require('pagination');

const generateBoostrapPaginator = (req, currentPage, itemsPerPage, totalCount) => {
    return new pagination.TemplatePaginator({
        prelink: "/" + req.session.user.type_utilisateur, current: currentPage, rowsPerPage: itemsPerPage,
        totalResult: totalCount, slashSeparator: true,
        template: function (result) {
            if (req.query.search) prelink = result.prelink + '?search=' + req.query.search + '&'
            else prelink = result.prelink + '?'
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
        const itemsPerPage = 5;
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * itemsPerPage;
        if (req.query.search) {
            Offre.search(req.query.search, itemsPerPage, offset, (err, results, totalCount) => {
                if (err) {
                    console.error('Error fetching offres: ', err);
                    res.redirect('/');
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

        } else {
            Offre.readWithLimit(itemsPerPage, offset, (err, results, totalCount) => {
                if (err) {
                    console.error('Error fetching offres: ', err);
                    res.redirect('/');
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

        const promise = Offre.createFichePoste(Fiche_poste)
            .then((results) => {
                offre.fiche_poste = results.insertId;
                const promise2 = Offre.createOffre(offre)
                    .then((results) => {
                        console.log(results);
                        res.render('partials/loading', { title: 'Accueil', message: 'L\'offre a été ajouté ! Vous allez être redirigé vers l\'accueil.' });
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })




    },


}


module.exports = offresController;