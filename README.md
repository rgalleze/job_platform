# SR10 Job portal
### Projet de développement web avec structure MVC utilisant Node.js et Express

Ce projet est une application web développée en utilisant la structure MVC (Modèle-Vue-Contrôleur) avec Node.js et Express. L'objectif principal de ce projet est de créer une application web robuste et évolutive en suivant les meilleures pratiques de développement.

### Fonctionnalités principales
- Ajouter une organisation (entreprise, association ou toute entité qui recrute)
- Ajouter des offres (+ éditer et supprimer une offre)
- Lister les offres (+ ajouter des filtres sur la liste)
- Chercher une offre par lieu, titre, type de poste, etc.
- Candidater à une offre
- Afficher la liste des candidats à une offre
- Télécharger les dossiers des candidats


### Technologies utilisées

Ce projet repose sur les technologies suivantes :

- Node.js : une plateforme de développement JavaScript côté serveur qui permet d'exécuter du code JavaScript en dehors d'un navigateur web.
- Express : un framework web minimaliste pour Node.js, permettant de créer rapidement des applications web robustes.
- MySQL : un système de gestion de base de données relationnelle utilisé pour stocker et récupérer les données de l'application.
- HTML/CSS : langages de base pour créer la structure et la mise en forme de l'interface utilisateur.
- JavaScript : langage de programmation principal utilisé pour implémenter la logique côté client et côté serveur.
- Bootstrap : un framework CSS populaire pour créer des interfaces utilisateur réactives et attrayantes.
- Multer : un middleware pour gérer le téléchargement de fichiers dans les applications Node.js.
- Bcrypt : une bibliothèque de hachage de mots de passe pour sécuriser les informations d'identification des utilisateurs.

### Installation

1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir Node.js et MongoDB installés sur votre machine.
3. Exécutez `npm install` pour installer les dépendances du projet.
4. Configurez les paramètres de connexion à votre base de données Mysql dans le fichier de configuration approprié.
5. Exécutez `npm start` pour lancer l'application.


### Strcuture du projet (MVC)
```
📦 job_platform
├─ app.js
├─ bin
│  └─ www
├─ controllers
│  ├─ authController.js
│  ├─ offresController.js
│  └─ usersController.js
├─ models
│  ├─ db.js
│  ├─ offre.js
│  ├─ org.js
│  └─ user.js
├─ node_modules
|  ├─ ...
|  └─ ...
├─ package-lock.json
├─ package.json
├─ public
│  └─ stylesheets
│     └─ style.css
├─ routes
│  ├─ admin.js
│  ├─ candidats.js
│  ├─ index.js
│  ├─ recruteurs.js
│  └─ users.js
└─ views
   ├─ admin
   │  ├─ dashboard.ejs
   │  ├─ displayUsers.ejs
   │  └─ voirOffre.ejs
   ├─ candidat
   │  ├─ applyRec.ejs
   │  ├─ applyRecOrg.ejs
   │  ├─ candidaterOffre.ejs
   │  ├─ dashboard.ejs
   │  ├─ orgForm.ejs
   │  ├─ voirCandidatures.ejs
   │  └─ voirOffre.ejs
   ├─ error.ejs
   ├─ index.ejs
   ├─ login.ejs
   ├─ partials
   │  ├─ footer.ejs
   │  ├─ header.ejs
   │  ├─ loading.ejs
   │  ├─ navbar.ejs
   │  └─ search.ejs
   ├─ recruteur
   │  ├─ ajouterOffre.ejs
   │  ├─ candidaturesOffre.ejs
   │  ├─ dashboard.ejs
   │  ├─ demandesRec.ejs
   │  ├─ editOffre.ejs
   │  └─ voirOffre.ejs
   └─ register.ejs
  ```
## Use cases diagramme
 ![](conception_et_modélisation/Diagramme_use_cases.png)
 
## Modélisation UML - MCD
 ![](conception_et_modélisation/MCD.png)

## Modèle MLD
 ![](conception_et_modélisation/MLD.png)

## Sécurité

### 1 - Violation de contrôle d’accès

Manque de contrôle d'accès au niveau fonctionnel : les applications doivent vérifier les droits d'accès au niveau fonctionnel sur le serveur lors de l'accès à chaque fonction. Si les demandes ne sont pas vérifiées, les attaquants seront en mesure de forger des demandes afin d'accéder à une fonctionnalité non autorisée.

**Constat 1**

Lors du diagnostic du site, on a remarqué qu'on ne vérifiait pas correctement les droits d'accès. Un utilisateur (candidat) pouvait avoir accès à l'espace admin ou recruteur en modifiant simplement l'URL.

**Correctif**

Nous avons donc mis en place un contrôle d'accès au niveau de `app.js` afin d'empêcher un utilisateur d'accéder à une fonctionnalité pour laquelle il n'a pas l'autorisation.

```javascript=
app.all("/recruteur*", function (req, res, next) {
  if(req.session.user.type_utilisateur!='recruteur'){
            res.send("Accés Non autorisé!")
        }else{next()}
});

app.all("/candidat*", function (req, res, next) {
  if(req.session.user.type_utilisateur!='candidat'){
            res.send("Accés Non autorisé!")
        }else{next()}
});

app.all("/admin*", function (req, res, next) {
  if(req.session.user.type_utilisateur!='admin'){
            res.send("Accés Non autorisé!")
        }else{next()}
});
```

**Constat 2**

On a pu remarquer une autre vulnérabilité : un recruteur peut avoir accès à des offres qui ne concernent pas son organisation juste en essayant des num_offres, exemple : 
```
http://localhost:3000/recruteur/offre/39
```
Dans ce cas même si l'offre 39 ne fait pas partie des offres appartenant à l'organisation du recruteur, il poura la voir (éditer/supprimer)

**Correctif**

On a développé une fonction supplémentaire dans le modèle "offre" qui permet de récupérer les numéros d'offres pour une organisation donnée.
```javascript=
getOffreIdByOrg: (id_org) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT num_offre FROM Offre where organisation = ?`,
                [id_org],
                (error, results) => {
                    if (error) reject(error);
                    else resolve(results)
                })
        })
    }
```

Puis on éffectue un contrôle pour vérifier si le numéro d'offre demandé fait partie des offres de l'organisation du recruteur

```javascript=
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
```
 ### 2 - Injection dans un formulaire qui manipule des noms de fichier pour supprimer ou afficher le fichier
 
 Pendant le diagnostic, on a découvert une autre vulnérabilité de type injection.
 Avant de découvrir cette vulnérabilité, on a créer un dossier `topsecret` content le fichier `secret.txt` ci-dessous : 
 ```
 CARTE BANCAIRE MR LOUNIS : 
IBAN : FR0517569000506458745237U81
NUMERO CARTE : 4278780081841268
DATE VALIDITÉ : 04/2027
CVV : 323

CARTE BANCAIRE MR AKHERAZ : 
IBAN : FR1717569000303139232969G58
NUMERO CARTE : 4391426850073178
DATE VALIDITÉ : 06/2026
CVV : 168
 ```
Puis à l'aide de l'URL permettant de télécharger les CV des candidats

```
http://localhost:3000/recruteur/offre/37/candidatures/candidatures/getfile?fichier_cible=Lakhlef_Hicham_9-CV.pdf
```
On a essayé de remonter vers le dossier `topsecret` pour avoir accès à `secret.txt`: On a remplacé `fichier_cible=Lakhlef_Hicham_9-CV.pdf` par  `fichier_cible=../topsecret/secret.txt`

Et puis MAUVAISE SURPRISE : On a accès aux (faux) codes bancaires de Mr Lounis et Mr Akheraz

**Correctif**

Il faudrait nettoyer `fichier_cible` avant d'exécuter la requête, pour cela on a utilisé le framework `sanitize-filename`, on l'ajoute à notre controller à l'aide de la commande 
```javascript=
const sanitize = require("sanitize-filename");
```
**Code :** 

```javascript=
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
```

### 3 - Injection XSS

Une faille d'injection XSS (Cross-Site Scripting) permet à un attaquant d'injecter du code malveillant (généralement du code JavaScript) dans les pages web consultées par d'autres utilisateurs. Lorsque ces utilisateurs visitent la page affectée, le code injecté s'exécute dans leur navigateur, ce qui peut entraîner diverses conséquences néfastes, telles que le vol de données, la manipulation du contenu de la page, le vol de sessions utilisateur, ou même le contrôle total de l'application.

Pour éviter ce type de faille, il est recommandé de valider les entrées utilisateurs (coté frontend et backend)

On a éssayer de prendre ça en considération, par exemple lors de la création d'un compte utilisateur. On éffectue une validation des inputs utilisateur grâce au framework `joi` : 

```javascript=
register: async (req, res) => {
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
      res.render('register', { title: 'register', error: error });
    } else {
        // On hash le mdp
        // On crée l'utilisateur
    }
```