import woodpecker from "../../woodpecker_co.app.mjs";

export default {
  key: "woodpecker_co-stop-follow-ups",
  name: "Stop Follow-Ups",
  description: "This action searches a specific prospect. [See the docs here](https://woodpecker.co/help/api-managing-prospects/)",
  version: "0.0.1",
  type: "action",
  props: {
    woodpecker,
    campaignId: {
      propDefinition: [
        woodpecker,
        "campaignId",
      ],
    },
    id: {
      propDefinition: [
        woodpecker,
        "campaignProspectId",
        (c) => ({
          campaignId: c.campaignId.value,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      id, campaignId,
    } = this;
    const [
      { email },
    ] = await this.woodpecker.listProspects({
      id,
    });
    const response = await this.woodpecker.createOrUpdateProspect({
      params: {
        id,
        email,
        status: "PAUSED",
      },
      campaignId: campaignId.value,
    });

    $.export("$summary", "Prospect successfully updated!");
    return response;
  },
};

