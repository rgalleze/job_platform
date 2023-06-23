const db = require("../models/db.js");
const user = require("../models/user.js");

// Mocking the db.query method
jest.mock("../models/db.js", () => ({
  query: jest.fn(),
}));

// Testing the create method
describe("create method", () => {
  it("should insert a new user into the database", () => {
    const data = { /* user data */ };
    const callback = jest.fn();

    db.query.mockImplementation((query, values, callback) => {
      expect(query).toBe("INSERT INTO Utilisateur SET ?");
      expect(values).toBe(data);

      // Simulate successful insertion
      callback(null, "success");
    });

    user.create(data, callback);

    expect(callback).toHaveBeenCalledWith(null, "success");
  });
});

// Testing the read method
describe("read method", () => {
  it("should retrieve a user from the database by email", () => {
    const email = "user@example.com";
    const callback = jest.fn();

    const expectedResult = { /* expected user data */ };

    db.query.mockImplementation((query, values, callback) => {
      expect(query).toBe("SELECT * FROM Utilisateur WHERE email = ?");
      expect(values).toEqual([email]);

      // Simulate successful retrieval
      callback(null, [expectedResult]);
    });

    user.read(email, callback);

    expect(callback).toHaveBeenCalledWith(null, expectedResult);
  });
});

// Testing the delete method
describe("delete method", () => {
  it("should delete a user from the database by ID", async () => {
    const id = 1;

    db.query.mockImplementation((query, values, callback) => {
      expect(query).toBe("Delete from Utilisateur where id = ? ");
      expect(values).toEqual([id]);

      // Simulate successful deletion
      callback(null, "success");
    });

    const result = await user.delete(id);

    expect(result).toBe("success");
  });
});

// Testing the updateStatut method
describe("updateStatut method", () => {
  it("should update the statut_compte of a user in the database", async () => {
    const id = 1;
    const statut = "active";

    db.query.mockImplementation((query, values, callback) => {
      expect(query).toBe("Update  Utilisateur set statut_compte = ? where id = ? ");
      expect(values).toEqual([statut, id]);

      // Simulate successful update
      callback(null, "success");
    });

    const result = await user.updateStatut(id, statut);

    expect(result).toBe("success");
  });
});