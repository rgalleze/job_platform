const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const authController = {
    firstLoad :  (req, res ) => {
      if (!req.session.user) {
        res.redirect('/login');
      }
      else if (req.session.user.type_utilisateur == 'candidat') {
        res.redirect('candidat');
      }
      else if (req.session.user.type_utilisateur == 'recruteur') {
        res.redirect('recruteur');
      }
      else if (req.session.user.type_utilisateur == 'Administrateur') {
        res.redirect('admin');
      }
    },
    showLogin : (req, res) => {
        res.render('login', { title: 'login' });
    },
    showRegister : (req, res) => {
        res.render('register', { title: 'register' });
    },
    login :  async  (req, res) => {
        User.read(req.body.email, async (error, user) => {
          if (user == null) {
            res.render('login', { title: 'login',error: 'Aucun compte n\'a été trouve !' })
          } else {
            const verifPassword = await bcrypt.compare(req.body.password, user.hash_motdepasse)
            if (verifPassword) {
              req.session.user = user;
              res.redirect('/');
            }
            else {
              res.render('login', { title: 'login',error: 'Mot de passe incorrect !' })
            }
          }
        })
    },
    register : async (req, res) =>{
        // On crée un schéma à suivre pour valider les inputs user
        const schema = Joi.object({
          nom: Joi.string().alphanum().min(3).max(30).required(),
          prenom: Joi.string().alphanum().min(3).max(30).required(),
          email: Joi.string().email({ minDomainSegments: 2 }),
          mot_de_passe: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required()
            .messages({
              "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
              "string.empty": `Password cannot be empty`,
              "any.required": `Password is required`,
            }),
          date_creation: Joi.date().required(),
          statut_compte: Joi.string().valid('actif'),
          // Par défault le type d'utilisateur est candidat
          type_utilisateur: Joi.string().valid('candidat')
        });
      
        // On valide les inputs user 
        const { error, value } = schema.validate({
          nom: req.body.nom,
          prenom: req.body.prenom,
          email: req.body.email,
          mot_de_passe: req.body.password,
          date_creation: new Date(),
          statut_compte: 'actif',
          type_utilisateur: 'candidat'
        });
      
        if (error) {
          // Si les inputs ne sont pas valides on affiche l'erreur 
          res.render('register', { title: 'register', error : error });
        } else {
          // On utilise middleware bcrypt pour hasher le mot de passe 
          const hashedPassword = await bcrypt.hash(value.mot_de_passe, 10)
          // On supprime le mot de passe en clair, on manipule que le hash
          delete value.mot_de_passe
          value.hash_motdepasse = hashedPassword
          User.create(value, (error, user) => {
            if (error) {
              console.log(error);
              return;
            }
            // On affiche une vue pour indiquer que le compte a été crée puis on redirige vers /login
            res.render('partials/loading', { title:'login',message: 'Votre compte a été crée ! Vous allez être redirigé vers la page de connexion.' });
          })
        }
    },
    logout :  (req, res) =>{
        // On détruit la session
        req.session.destroy(function (err) {
          if (err) {
            console.log(err);
          } else {
            // On redirige l'utilisateur vers la page de connexion
            res.redirect('/login');
          }
        });
    }
    }
module.exports = authController;