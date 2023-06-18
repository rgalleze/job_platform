const User = require('../models/user');

const usersController = {
    getCandidatures: (req,res) =>{
        const promise = User.readCandidatures(req.session.user.id)
        .then((results)=>[
            res.render('candidat/voirCandidatures',{title:'Candidatures',user: req.session.user,candidatures : results})
        ])
        .catch((error)=>{
            console.log(error)
        })

        //
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
    
}

module.exports = usersController;