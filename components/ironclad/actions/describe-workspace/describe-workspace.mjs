import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-describe-workspace",
  name: "Describe Workspace",
  description: "Orients you to this Ironclad workspace: returns every configured record type and property (with its type), plus the first page of launchable workflow templates. This is the primary orienting call — run it first for any question about what record types, properties, or workflow templates exist in the workspace, before **List Type Options** / **List Properties Options** / **List Template ID Options** (those three exist only to resolve one value while configuring another tool's prop, not for general discovery — using them for discovery skips the bundled context this tool provides). Takes no parameters. If `workflowTemplates` looks capped at a page boundary, run **List Template ID Options** with an incremented `page` for the rest. Example return: `{\"recordTypes\": {\"vendor_agreement\": \"Vendor Agreement\"}, \"properties\": {\"contractValue\": \"monetary_amount\", \"counterpartyName\": \"string\"}, \"workflowTemplates\": [{\"id\": \"tmpl_abc123\", \"name\": \"NDA Template\"}]}`. [See the documentation](https://developer.ironcladapp.com/reference/retrieve-records-metadata)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    ironclad,
  },
  async run({ $ }) {
    const [
      recordsSchema,
      workflowSchemas,
    ] = await Promise.all([
      this.ironclad.getRecordsSchema({
        $,
      }),
      this.ironclad.listWorkflowSchemas({
        $,
      }),
    ]);

    const recordTypes = Object.fromEntries(
      Object.entries(recordsSchema.recordTypes ?? {}).map(([
        key,
        value,
      ]) => [
        key,
        value.displayName,
      ]),
    );
    const properties = Object.fromEntries(
      Object.entries(recordsSchema.properties ?? {}).map(([
        key,
        value,
      ]) => [
        key,
        value.type,
      ]),
    );
    const workflowTemplates = (workflowSchemas.list ?? []).map(({
      id, name,
    }) => ({
      id,
      name,
    }));

    $.export("$summary", `Found ${Object.keys(recordTypes).length} record type(s), ${Object.keys(properties).length} propert${Object.keys(properties).length === 1
      ? "y"
      : "ies"}, and ${workflowTemplates.length} workflow template(s)`);
    return {
      recordTypes,
      properties,
      workflowTemplates,
    };
  },
};
