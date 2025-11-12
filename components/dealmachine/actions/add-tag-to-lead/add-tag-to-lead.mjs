import dealmachine from "../../dealmachine.app.mjs";

export default {
  key: "dealmachine-add-tag-to-lead",
  name: "Add Tags to Lead",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add tags(s) to the lead. [See the documentation](https://docs.dealmachine.com/#ba760bae-ed7e-4b88-91ab-4f67668b111c)",
  type: "action",
  props: {
    dealmachine,
    leadId: {
      propDefinition: [
        dealmachine,
        "leadId",
      ],
    },
    tagIds: {
      propDefinition: [
        dealmachine,
        "tagIds",
      ],
    },
  },
  async run({ $ }) {
    const {
      dealmachine,
      leadId,
      tagIds,
    } = this;

    const { data: response } = await dealmachine.addTagsToLead({
      $,
      leadId,
      data: {
        tag_ids: tagIds.toString(),
      },
    });

    $.export("$summary", `The tag(s) with Id(s): ${tagIds.toString()} ${tagIds.length > 1
      ? "where"
      : "was"} successfully added!`);
    return response;
  },
};
