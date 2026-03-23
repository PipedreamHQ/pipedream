import assert from "node:assert/strict";
import test from "node:test";
import {
  allOptional,
  buildPropsFromSchema,
  fieldsFromSchema,
} from "./action-schema.mjs";

const mockApp = {
  name: "servicem8",
};

test("buildPropsFromSchema builds inline props", () => {
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
  assert.deepEqual(props.title, {
    type: "string",
    label: "Title",
    optional: true,
    description: "Note title",
  });
});

test("buildPropsFromSchema uses propDefinition", () => {
  const schema = [
    {
      prop: "jobId",
      propDefinition: "listJobs",
      optional: false,
    },
  ];
  const props = buildPropsFromSchema(mockApp, schema);
  assert.deepEqual(props.jobId, {
    propDefinition: [
      mockApp,
      "listJobs",
    ],
    optional: false,
  });
});

test("fieldsFromSchema maps props and transforms", () => {
  const schema = [
    {
      prop: "active",
      api: "active",
      transform: (v) => (v
        ? 1
        : 0),
    },
    {
      prop: "name",
      api: "company_name",
    },
  ];
  const component = {
    active: true,
    name: "Acme",
  };
  assert.deepEqual(fieldsFromSchema(component, schema), {
    active: 1,
    company_name: "Acme",
  });
});

test("allOptional marks every field optional", () => {
  const schema = [
    {
      prop: "a",
      type: "string",
      label: "A",
      optional: false,
    },
    {
      prop: "b",
      type: "string",
      label: "B",
    },
  ];
  assert.ok(allOptional(schema).every((f) => f.optional === true));
});
