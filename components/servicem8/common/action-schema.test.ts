import {
  allOptional,
  buildPropsFromSchema,
  fieldsFromSchema,
} from "./action-schema.mjs";

const mockApp = { name: "servicem8" };

describe("servicem8/common/action-schema", () => {
  describe("buildPropsFromSchema", () => {
    it("builds inline props from schema", () => {
      const schema = [
        {
          prop: "title",
          type: "string",
          label: "Title",
          optional: true,
          description: "Note title",
        },
      ];
      const props = buildPropsFromSchema(mockApp, schema);
      expect(props.title).toEqual({
        type: "string",
        label: "Title",
        optional: true,
        description: "Note title",
      });
    });

    it("uses propDefinition when present", () => {
      const schema = [
        {
          prop: "jobId",
          propDefinition: "listJobs",
          optional: false,
        },
      ];
      const props = buildPropsFromSchema(mockApp, schema);
      expect(props.jobId).toEqual({
        propDefinition: [mockApp, "listJobs"],
        optional: false,
      });
    });
  });

  describe("fieldsFromSchema", () => {
    it("maps props to api keys and applies transforms", () => {
      const schema = [
        { prop: "active", api: "active", transform: (v: boolean) => (v ? 1 : 0) },
        { prop: "name", api: "company_name" },
      ];
      const component = { active: true, name: "Acme" };
      expect(fieldsFromSchema(component, schema)).toEqual({
        active: 1,
        company_name: "Acme",
      });
    });
  });

  describe("allOptional", () => {
    it("marks every field optional", () => {
      const schema = [
        { prop: "a", type: "string", label: "A", optional: false },
        { prop: "b", type: "string", label: "B" },
      ];
      expect(allOptional(schema).every((f) => f.optional === true)).toBe(true);
    });
  });
});
