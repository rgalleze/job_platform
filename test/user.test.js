const db = require("../models/db.js");
const user = require("../models/user.js");

describe("User Tests", () => {

   
    let userID = null;
    test("read user", () => {
        nom = null;
        function Read(resultat) {
            nom = resultat[0].nom;
            expect(nom).toBe("jest");
        }
        user.read("jest@test.fr", Read);
    });

    test("create user", async () => {
        let data = await model.createUser("test@test.fr", "test", "TEST", "Test", "0605040302", "candidat", "Null Island");
        expect(data).toBeDefined();
        userID = data.insertId;
    });


})

