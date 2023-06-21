const User = require('../models/user');
const org = require('../models/org');


const usersController = {
    getCandidatures: (req,res) =>{
        const promise = User.readCandidatures(req.session.user.id)
        .then((results)=>[
            res.render('candidat/voirCandidatures',{title:'Candidatures',user: req.session.user,candidatures : results})
        ])
        .catch((error)=>{
            console.log(error)
        })
    },
    deleteCandidature: (req,res) =>{
        const promise = User.deleteCandidature(parseInt(req.query.id_candidature))
        .then((results)=>[
            res.redirect('../mesCandidatures')
        ])
        .catch((error)=>{
            console.log(error)
        })

        //
    },
    showRecApply: (req,res) =>{
        res.render('candidat/applyRec',{title :'Devenir recruteur',user: req.session.user})

    },
    showRecApplyOrg: (req, res)=>{
        const promise = org.readAll()
        .then((results)=>{
            res.render('candidat/applyRecOrg',{title :'Devenir recruteur',user: req.session.user, orgs: results})
    })
        .catch((error)=>{
            console.log(error)
        })
        
    },
    recApply: (req,res) => {
        const data = {
            date_demande: new Date(),
            statut: 'non traite',
            organisation: req.body.id_org,
            utilisateur: req.session.user.id
        }
        const promise = User.updateRec(data)
        .then((results)=>{
            res.render('partials/loading',{title: 'Devenir recruteur',user: req.session.user, message: 'Votre demande a été prise en compte !'})
        })
        .catch((error)=>{
            console.log(error)
        })

    },
    showAddOrg: (req,res) => {
        res.render('candidat/orgForm',{title :'Ajouter une organisation',user: req.session.user})
    },
    AddOrgRec: (req,res) => {
        const data = {
            siren: req.body.siren,
            nom: req.body.nom,
            rue: req.body.rue,
            ville: req.body.ville,
            region: req.body.region,
            code_postal: req.body.code_postal,
            pays: req.body.pays
        }
        const promise = org.create(data)
        .then((results)=>{
            const dataRec = {
                date_demande: new Date(),
                statut: 'non traite',
                organisation: req.body.siren,
                utilisateur: req.session.user.id
            }
            const promise = User.updateRec(dataRec)
            .then((results)=>{
                res.render('partials/loading',{title: 'Devenir recruteur',user: req.session.user, message: 'Votre demande a été prise en compte !'})
            })
            .catch((error)=>{
                console.log(error)
            })
                })
        .catch((error)=>{
            console.log(error)
        })
    },
    showDemandesRec: (req, res) => {
        const promise = User.readDemandesRec(req.session.user.organisation)
        .then((results)=>{
            res.render('recruteur/demandesRec',{title: 'DDemandes',user: req.session.user,demandes : results})
        })
        .catch((error)=>{
            console.log(error)
        })
    },
    acceptDemandeRec: (req, res) => {
        const promise = User.acceptRec(req.query.id,req.session.user.organisation)
        .then((results)=>{
            res.redirect('./')
        })
        .catch((error)=>{
            console.log(error)
        })
    },
    refuseDemandeRec: (req, res) => {
        const promise = User.refuseRec(req.query.id,req.session.user.organisation)
        .then((results)=>{
            res.redirect('../demandes')
        })
        .catch((error)=>{
            console.log(error)
        })
    },
    AddOrgAdmin: (req,res) => {
        const data = {
            siren: req.body.siren,
            nom: req.body.nom,
            rue: req.body.rue,
            ville: req.body.ville,
            region: req.body.region,
            code_postal: req.body.code_postal,
            pays: req.body.pays
        }
        const promise = org.create(data)
        .then((results)=>{
            res.render('partials/loading',{title: 'Add org',user: req.session.user, message: 'L\'organisation a été ajouté !'})
        })
        .catch((error)=>{
            console.log(error)
        })
    },
    getUsers: (req,res) => {
        User.readAll((err,results)=>{
            if(results){
                res.render('admin/displayUsers',{title: 'Users',user: req.session.user,users : results})
            }
        })
    },
    deleteUser: (req,res) => {
        const promise = User.delete(req.query.id)
        .then((results)=>{
            res.redirect('./')
        })
        .catch((error)=>{
            console.log(error)
        })

    },
    UpdateStatutUser: (req,res) => {
        const promise = User.updateStatut(req.query.id,req.query.s)
        .then((results)=>{
            res.redirect('./')
        })
        .catch((error)=>{
            console.log(error)
        })

    }

    
}

module.exports = usersController;