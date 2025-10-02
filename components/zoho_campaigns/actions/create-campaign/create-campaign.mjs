import app from "../../zoho_campaigns.app.mjs";

export default {
  type: "action",
  key: "zoho_campaigns-create-campaign",
  name: "Create Campaign",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "You can create a campaign using this API. Using this API, you can set the campaign name, subject line, sender address; choose the intended mailing list.. [See the documentation](https://www.zoho.com/campaigns/help/developers/create-campaign.html)",
  props: {
    app,
    campaignname: {
      type: "string",
      label: "Campaign Name",
      description: "The name of the campaign",
    },
    from_email: {
      type: "string",
      label: "From Email",
      description: "The email address from which the campaign is sent",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the campaign",
    },
    content_url: {
      type: "string",
      label: "Content URL",
      description: "A valid HTML URL for your campaign content",
    },
    mailingList: {
      propDefinition: [
        app,
        "mailingList",
      ],
      type: "string[]",
    },
    topicId: {
      propDefinition: [
        app,
        "topic",
      ],
    },
  },
  methods: {
    getListDetails(mailingList) {
      const data = {};
      for (const id of mailingList) {
        data[id] = [];
      }
      return JSON.stringify(data);
    },
  },
  async run({ $ }) {
    const {
      app,
      mailingList,
      getListDetails,
      ...rest
    } = this;

    const data = {
      ...rest,
      list_details: getListDetails(mailingList),
    };
    const res = await app.createCampaign(data);
    if (res.status === "error" || (res.code && parseInt(res.code) !== 200)) {
      throw new Error(`${res.message} - ${JSON.stringify(res)}`);
    }
    $.export("summary", `Campaign "${res.campaign_name}" created successfully`);
    return res;
  },
};
