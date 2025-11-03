import app from "../../nextdoor.app.mjs";

export default {
  key: "nextdoor-create-ad",
  name: "Create Ad",
  description: "Creates an ad based on the input payload for an existing NAM ad group. [See the documentation](https://developer.nextdoor.com/reference/ad-create).",
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
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
        ({ advertiserId }) => ({
          advertiserId,
        }),
      ],
    },
    adGroupId: {
      propDefinition: [
        app,
        "adGroupId",
        ({
          advertiserId,
          campaignId,
        }) => ({
          advertiserId,
          campaignId,
        }),
      ],
    },
    creativeId: {
      propDefinition: [
        app,
        "creativeId",
        ({ advertiserId }) => ({
          advertiserId,
        }),
      ],
    },
    name: {
      description: "The name of the ad.",
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  methods: {
    createAd(args = {}) {
      return this.app.post({
        path: "/ad/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createAd,
      advertiserId,
      adGroupId,
      creativeId,
      name,
    } = this;

    const response = await createAd({
      $,
      data: {
        advertiser_id: advertiserId,
        adgroup_id: adGroupId,
        creative_id: creativeId,
        name,
      },
    });

    $.export("$summary", `Successfully created ad with ID \`${response.id}\`.`);
    return response;
  },
};
