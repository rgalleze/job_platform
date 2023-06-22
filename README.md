# SR10 Job portal
# Projet de développement web avec structure MVC utilisant Node.js et Express

Ce projet est une application web développée en utilisant la structure MVC (Modèle-Vue-Contrôleur) avec Node.js et Express. L'objectif principal de ce projet est de créer une application web robuste et évolutive en suivant les meilleures pratiques de développement.

## Fonctionnalités principales
- Ajouter une organisation (entreprise, association ou toute entité qui recrute)
- Ajouter des offres (+ éditer et supprimer une offre)
- Lister les offres (+ ajouter des filtres sur la liste)
- Chercher une offre par lieu, titre, type de poste, etc.
- Candidater à une offre
- Afficher la liste des candidats à une offre
- Télécharger les dossiers des candidats


## Technologies utilisées

Ce projet repose sur les technologies suivantes :

- Node.js : une plateforme de développement JavaScript côté serveur qui permet d'exécuter du code JavaScript en dehors d'un navigateur web.
- Express : un framework web minimaliste pour Node.js, permettant de créer rapidement des applications web robustes.
- MySQL : un système de gestion de base de données relationnelle utilisé pour stocker et récupérer les données de l'application.
- HTML/CSS : langages de base pour créer la structure et la mise en forme de l'interface utilisateur.
- JavaScript : langage de programmation principal utilisé pour implémenter la logique côté client et côté serveur.
- Bootstrap : un framework CSS populaire pour créer des interfaces utilisateur réactives et attrayantes.
- Multer : un middleware pour gérer le téléchargement de fichiers dans les applications Node.js.
- Bcrypt : une bibliothèque de hachage de mots de passe pour sécuriser les informations d'identification des utilisateurs.

## Installation

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
