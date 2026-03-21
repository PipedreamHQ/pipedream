import {
  describe,
  it,
  expect,
} from "@jest/globals";
import * as logic from "../servicem8.app.logic.js";

describe("servicem8 buildListQueryParams", () => {
  describe("buildListQueryParams", () => {
    it("returns empty object when no list args are set", () => {
      expect(logic.buildListQueryParams({})).toEqual({});
    });

    it("maps filter, sort, and cursor to API query keys", () => {
      expect(logic.buildListQueryParams({
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
      expect(logic.buildListQueryParams({
        filter: "",
        sort: "",
        cursor: "",
      })).toEqual({});
    });
  });

  describe("propDefinitions (list query)", () => {
    it("defines filter, sort, and cursor as optional string props", () => {
      expect(logic.listQueryPropDefinitions).toMatchObject({
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
