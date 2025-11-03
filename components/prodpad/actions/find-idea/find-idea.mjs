import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-find-idea",
  name: "Find Idea",
  description: "Finds an idea. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Ideas/GetIdeas).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    externalId: {
      propDefinition: [
        app,
        "externalId",
      ],
    },
    externalUrl: {
      propDefinition: [
        app,
        "externalUrl",
      ],
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "One or more tag names to filter the ideas by.",
      optional: true,
      propDefinition: [
        app,
        "tagId",
      ],
    },
    status: {
      label: "Status",
      description: "Name of a workflow status to filter the ideas by.",
      optional: true,
      propDefinition: [
        app,
        "statusId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      externalId,
      externalUrl,
      tagIds,
      status,
    } = this;

    const { ideas } = await this.app.listIdeas({
      step,
      params: {
        external_id: externalId,
        external_url: externalUrl,
        status,
        tags: utils.mapOrParse(tagIds).join(","),
      },
    });

    step.export("$summary", `Successfully found ${utils.summaryEnd(ideas.length, "idea")}`);

    return ideas;
  },
};
