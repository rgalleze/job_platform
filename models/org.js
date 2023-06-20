const db = require("./db");

const org = {
    readAll: () =>{
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM Organisation ', (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })
        })

    },
    create: (data) =>{
        return new Promise((resolve, reject) => {
            db.query('INSERT  INTO Organisation SET ?',data, (error, results) => {
                if (error) reject(error);
                else resolve(results)
            })
        })

    }

    
}

module.exports = org;