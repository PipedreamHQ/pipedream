const {
  describe,
  it,
  expect,
  beforeAll,
} = require("@jest/globals");

describe("servicem8 buildListQueryParams", () => {
  let buildListQueryParams;
  let propDefinitions;

  beforeAll(async () => {
    const appMod = await import("../servicem8.app.mjs");
    buildListQueryParams = appMod.default.methods.buildListQueryParams;
    propDefinitions = appMod.default.propDefinitions;
  });

  describe("buildListQueryParams", () => {
    it("returns empty object when no list args are set", () => {
      expect(buildListQueryParams({})).toEqual({});
    });

    it("maps filter, sort, and cursor to API query keys", () => {
      expect(buildListQueryParams({
        filter: "active eq 1",
        sort: "edit_date desc",
        cursor: "abc123",
      })).toEqual({
        $filter: "active eq 1",
        $sort: "edit_date desc",
        cursor: "abc123",
      });
    });

    it("omits empty strings so unset props do not appear in the request", () => {
      expect(buildListQueryParams({
        filter: "",
        sort: "",
        cursor: "",
      })).toEqual({});
    });
  });

  describe("propDefinitions (list query)", () => {
    it("defines filter, sort, and cursor as optional string props", () => {
      expect(propDefinitions).toMatchObject({
        filter: expect.objectContaining({
          type: "string",
          optional: true,
        }),
        sort: expect.objectContaining({
          type: "string",
          optional: true,
        }),
        cursor: expect.objectContaining({
          type: "string",
          optional: true,
        }),
      });
    });
  });
});
