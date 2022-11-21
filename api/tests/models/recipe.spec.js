const { Recipe, conn } = require("../../src/db.js");
const { expect } = require("chai");
const { ValidationError } = require("sequelize");

describe("Recipe model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  describe("Validators", () => {
    beforeEach(() => Recipe.sync({ force: true }));
    describe("name", () => {
      it("should throw an error if name and summary is null", (done) => {
        Recipe.create({})
          .then(() => done(new Error("It requires a valid name")))
          .catch(() => done());
      });
      it("should work when its a valid name", async () => {
        await Recipe.create({ name: "Frijoles", summary: "Frijoles" });
        const res = await Recipe.findAll({ where: { name: "Frijoles" } });
        console.log(res[0].dataValues.name);
        expect(res[0].dataValues.name).equal("Frijoles");
      });
      it("should throw error if image is not valid", async () => {
        try {
          await Recipe.create({ name: "tira", image: "p", summary: "tira" });
        } catch (error) {
          expect(error).instanceOf(ValidationError);
          expect(error.message).equal(
            "Validation error: Validation isUrl on image failed"
          );
        }
      });
      it("should throw error if name have more than 25 characteres",async()=>{
        try {
          await Recipe.create({ name: "turamgtucpsgtjwtuljfndthgf", summary: "tira" });
        } catch (error) {
          expect(error).instanceOf(Error)
          
        }
      })
      it('should throw error if healthscore is more than 100',async()=>{
        try {
          await Recipe.create({ name: "turamgtucpsgtjwtuljfndthgf", summary: "tira",healthScore:105 });
        } catch (error) {
          expect(error).instanceOf(ValidationError)
          expect(error.message).equal(
            "Validation error: Validation max on healthScore failed"
          );
          
        }
      })
    });
  });
});
