import app from "../../nextdoor.app.mjs";

export default {
  key: "nextdoor-create-campaign",
  name: "Create Campaign",
  description: "Creates a campaign. [See the documentation](https://developer.nextdoor.com/reference/campaign-create).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
    },
    name: {
      description: "The name of the campaign.",
      propDefinition: [
        app,
        "name",
      ],
    },
    objective: {
      propDefinition: [
        app,
        "objective",
      ],
    },
  },
  methods: {
    createCampaign(args = {}) {
      return this.app.post({
        path: "/campaign/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCampaign,
      advertiserId,
      name,
      objective,
    } = this;

    const response = await createCampaign({
      $,
      data: {
        advertiser_id: advertiserId,
        name,
        objective,
      },
    });

    $.export("$summary", `Successfully created campaign with ID \`${response.id}\`.`);
    return response;
  },
};
