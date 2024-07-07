const {
  checkUserAccessOrganisation,
} = require("./../src/controlers/auth/checkUserAccess.organisation.js");

describe("Organisation Access", () => {
  it("should allow access to users who belong to the organisation", () => {
    const users = [{ userId: 1 }, { userId: 2 }, { userId: 3 }];
    const userId = 2;
    expect(checkUserAccessOrganisation(users, userId)).toBe(true);
  });

  it("should deny access to users who do not belong to the organisation", () => {
    const users = [{ userId: 1 }, { userId: 2 }, { userId: 3 }];
    const userId = 4;
    expect(checkUserAccessOrganisation(users, userId)).toBe(false);
  });
});
