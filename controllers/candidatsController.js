const Offre = require('../models/offre');
const pagination = require('pagination');


const candidatsController = {
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
                        prelink: '/candidats', current: currentPage, rowsPerPage: itemsPerPage,
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
                    res.render('candidat/dashboardCandidat', {
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

    voirOffre : (req, res) => {
        Offre.read(req.params.id, (err, result) => {
           
            res.render('candidat/voirOffre', {title:'Offre',user : req.session.user,result: result});
        })
    
    
    }

}


module.exports = candidatsController;