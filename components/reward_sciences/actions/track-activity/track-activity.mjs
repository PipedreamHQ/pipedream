import rewardSciences from "../../reward_sciences.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "reward_sciences-track-activity",
  name: "Track Activity",
  description: "Records an activity for a participant in Reward Sciences. [See the documentation](https://developers.rewardsciences.com/api/docs)",
  version: "0.0.{{ts}}",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rewardSciences,
    idp: {
      type: "string",
      label: "IDP",
      description: "The identity provider can anything that represents the provider uniquely for your merchant. Examples: `email`, `CRM`, `internal-system`, `facebook`, `X` or whatever you prefer.",
    },
    identity: {
      type: "string",
      label: "Identity",
      description: "The identity field specifies a unique identifier for the user withing the context of the specified provider. Values are also arbitrary, they could represent a unique email address, a user ID within an external platform or anything that can uniquely identify a user within it.",
    },
    activityType: {
      type: "string",
      label: "Activity Type",
      description: "Activity type represents a unique, case-insensitive, activity the user can perform. For example: `bought-coffee`, `redeemed-code`, `attended-event`, etc.",
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "Optional custom fields to associate with the tracked activity as metadata",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rewardSciences.trackActivity({
      $,
      data: {
        idp: this.idp,
        identity: this.identity,
        activity_type: this.activityType,
        fields: parseObject(this.fields),
      },
    });
    $.export("$summary", `Activity successfully tracked with ID "${response.id}"`);
    return response;
  },
};
