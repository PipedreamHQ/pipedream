import { parseObject } from "../../common/utils.mjs";
import ortto from "../../ortto.app.mjs";

export default {
  key: "ortto-create-custom-activity",
  name: "Create Custom Activity",
  description: "Creates a unique activity for a person. Can optionally initialize a new record beforehand. [See the documentation](https://help.ortto.com/a-271-create-a-custom-activity-event-create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ortto,
    activityId: {
      propDefinition: [
        ortto,
        "activityId",
      ],
    },
    attributes: {
      propDefinition: [
        ortto,
        "attributes",
      ],
    },
    fields: {
      propDefinition: [
        ortto,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ortto.createCustomActivity({
      $,
      data: {
        "activities": [
          {
            activity_id: this.activityId,
            attributes: parseObject(this.attributes),
            fields: parseObject(this.fields),
          },
        ],
        "merge_by": [
          "str::email",
        ],
      },
    });

    $.export("$summary", "Successfully created activity");
    return response;
  },
};
