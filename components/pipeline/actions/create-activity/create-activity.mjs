import pipeline from "../../pipeline.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Create Activity",
  key: "pipeline-create-activity",
  description: "Creates a new activity associated with an existing person, company, or deal. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Activities-(Notes)/paths/~1notes/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipeline,
    personId: {
      propDefinition: [
        pipeline,
        "personId",
      ],
    },
    dealId: {
      propDefinition: [
        pipeline,
        "dealId",
      ],
    },
    companyId: {
      propDefinition: [
        pipeline,
        "companyId",
      ],
    },
    noteCategoryId: {
      propDefinition: [
        pipeline,
        "noteCategoryId",
      ],
    },
    userId: {
      propDefinition: [
        pipeline,
        "userId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The note content",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.personId && !this.dealId && !this.companyId) {
      throw new ConfigurationError("At least one of `personId`, `dealId`, or `companyId` must be entered.");
    }

    const data = {
      note: {
        person_id: this.personId,
        deal_id: this.dealId,
        company_id: this.companyId,
        note_category_id: this.noteCategoryId,
        user_id: this.userId,
        content: this.content,
      },
    };

    const response = await this.pipeline.createActivity({
      data,
      $,
    });

    $.export("$summary", `Successfully created Activity with ID ${response.id}.`);

    return response;
  },
};
