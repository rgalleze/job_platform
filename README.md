# SR10 Job portal
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


## Modélisation UML - MCD
 ![](conception_et_modélisation/MCD.png)
 ```plantuml
@startuml
class Utilisateur {
    +id : int {key}
    +email: varchar
    +hash_motdepasse: varchar
    +nom: varchar
    +prenom: varchar
    +statut_compte: statut_compte
    +type_utilisateur: type_utilisateur
    +date_creation: date
    +organisation: varchar

}

class Recruteur {
}

class Candidat {
}

class Administrateur {
}

class Organisation {
    +siren: string {key}
    +nom: string
    +type: string
    +rue: varchar
    +ville: varchar
    +region: varchar
    +code_postal: int
    +pays: varchar
}

class Offre {
    +num_offre: int {key}
    +organisation: varchar
    +date_validite: date
    +etat: varchar
    +fiche_poste: int
    +pcs_demandees: text
    
}




class Dossier_candidature {
    +id: int {key}
    +date_candidature: date
    +statut_candidature: statut
    +utilisateur: int
    +offre: int
    +pathFiles: text
}



class Demande_recruteur {
    +id: int {key}
    +statut: statut
    +date_demande: date
    +utilisateur: id
    +organisation: varchar
}

class Fiche_poste{
+id : int {key}
+organisation: varchar
+date_ajout: date
+intitule: varchar
+responsable: varchar
+type_metier: varchar
+rythme: varchar
+fourchette_min: int
+fourchette_max: int
+description: text
}

enum statut_compte{
-actif
-inactif
-banni
}

enum statut{
-en cours
-en attente de traitement
-refusé
-accepté
}


enum type_utilisateur{
-admin
-recruteur
-candidat
}

Candidat "0..*" -- "0..1" Organisation
(Candidat, Organisation) . Demande_recruteur


Utilisateur <|-left- Recruteur

Utilisateur <|-- Candidat
Utilisateur <|-right- Administrateur

Candidat "0..*" -- "0..*" Offre
(Candidat, Offre) . Dossier_candidature


Organisation "1" *-left-- "0..*" Recruteur
Organisation "1" *-right-- "1..*" Offre
Fiche_poste "1" *-left- "*" Offre

@enduml
 ```
 
 ## Modèle MLD
 ![](conception_et_modélisation/MLD.png)
