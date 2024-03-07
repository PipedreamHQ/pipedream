import reachmail from "../../reachmail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "reachmail-schedule-campaign",
  name: "Schedule Campaign",
  description: "Schedule a campaign using a preset mailing ID. [See the documentation](https://services.reachmail.net/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    reachmail,
    mailingId: {
      propDefinition: [
        reachmail,
        "mailingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.reachmail.scheduleCampaign({
      mailingId: this.mailingId,
    });
    $.export("$summary", `Successfully scheduled campaign with mailing ID ${this.mailingId}`);
    return response;
  },
};
