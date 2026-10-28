import streak from "../../streak.app.mjs";

const docLink = "https://streak.readme.io/reference/list-all-fields-in-a-pipeline";

export default {
  key: "streak-list-pipeline-fields",
  name: "List Pipeline Fields",
  description: `List the custom fields of a pipeline, including each field's key, name, type, and the keys of its tag or dropdown options. Use the field keys with **Update Box Field Value**. [See the documentation](${docLink})`,
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    streak,
    pipelineId: {
      propDefinition: [
        streak,
        "pipelineId",
      ],
    },
  },
  async run({ $ }) {
    const fields = await this.streak.listPipelineFields({
      $,
      pipelineId: this.pipelineId,
    });
    $.export("$summary", `Successfully retrieved ${fields.length} field${fields.length === 1
      ? ""
      : "s"}`);
    return fields;
  },
};
