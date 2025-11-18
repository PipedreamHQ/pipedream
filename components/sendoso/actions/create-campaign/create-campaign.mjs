import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-create-campaign",
  name: "Create Campaign",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new campaign in Sendoso. [See the documentation](https://sendoso.docs.apiary.io/#reference/campaign-management)",
  type: "action",
  props: {
    sendoso,
    name: {
      type: "string",
      label: "Campaign Name",
      description: "Name of the campaign.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the campaign.",
      optional: true,
    },
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
      optional: true,
      description: "Group ID to associate with this campaign.",
    },
  },
  async run({ $ }) {
    const {
      name,
      description,
      groupId,
    } = this;

    const data = {
      name,
    };
    if (description) data.description = description;
    if (groupId) data.group_id = groupId;

    const response = await this.sendoso.createCampaign({
      $,
      ...data,
    });

    $.export("$summary", `Successfully created campaign: ${name}`);
    return response;
  },
};

