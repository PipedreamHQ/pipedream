import supabaseManagementApi from "../../supabase_management_api.app.mjs";

export default {
  key: "supabase_management_api-generate-typescript-types",
  name: "Generate TypeScript Types",
  description: "Generates TypeScript types based on the current database schema for a specified Supabase project. [See the documentation](https://supabase.com/docs/reference/api/v1-generate-typescript-types)",
  version: "0.0.1",
  type: "action",
  props: {
    supabaseManagementApi,
    projectRef: {
      propDefinition: [
        supabaseManagementApi,
        "projectRef",
      ],
    },
    includedSchemas: {
      type: "boolean",
      label: "Included Schemas",
      description: "Schemas to be included in the TypeScript types generation",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.supabaseManagementApi.generateTypescriptTypes({
      $,
      projectRef: this.projectRef,
      params: {
        include_schemas: this.includeSchemas,
      },
    });
    $.export("$summary", `Successfully generated TypeScript types for project ${this.projectRef}`);
    return response;
  },
};
