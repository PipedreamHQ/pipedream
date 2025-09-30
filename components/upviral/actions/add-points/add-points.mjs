import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import upviral from "../../upviral.app.mjs";

export default {
  key: "upviral-add-points",
  name: "Add Points",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add points in user profile. [See the documentation](https://api.upviral.com/#add-points)",
  type: "action",
  props: {
    upviral,
    campaignId: {
      propDefinition: [
        upviral,
        "campaignId",
      ],
    },
    leadId: {
      propDefinition: [
        upviral,
        "leadId",
        ({ campaignId }) => ({
          campaignId,
        }),
      ],
    },
    points: {
      type: "string",
      label: "Points",
      description: "The points to add.",
    },
  },
  async run({ $ }) {
    var bodyFormData = new FormData();
    bodyFormData.append("campaign_id", this.campaignId);
    bodyFormData.append("lead_id", this.leadId);
    bodyFormData.append("points", this.points);

    const response = await this.upviral.addPoints({
      $,
      data: bodyFormData,
      headers: bodyFormData.getHeaders(),
    });

    if (response.result === "error") throw new ConfigurationError(response.message);

    $.export("$summary", `${this.points} points were successfully added!`);
    return response;
  },
};
