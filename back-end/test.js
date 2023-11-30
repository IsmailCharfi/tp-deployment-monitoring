const { expect } = require("chai");

describe("TODO API", () => {
  describe("Mock Test", () => {
    it("should pass if FAILURE variable is not true", () => {
      expect(process.env.FAILURE?.trim() ?? "").to.not.equal("true");
    });
  });
});
