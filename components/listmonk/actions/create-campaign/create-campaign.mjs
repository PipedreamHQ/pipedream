import listmonk from "../../listmonk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "listmonk-create-campaign",
  name: "Create Campaign",
  description: "Creates a new campaign in Listmonk. [See the documentation](https://listmonk.app/docs/apis/campaigns/#post-apicampaigns)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    listmonk,
    name: {
      type: "string",
      label: "Campaign Name",
      description: "The name of the campaign to create.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the campaign.",
    },
    listIds: {
      propDefinition: [
        listmonk,
        "listIds",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the campaign.",
      options: constants.CAMPAIGN_TYPE_OPTIONS,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The content type of the campaign.",
      options: constants.CONTENT_TYPE_OPTIONS,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the campaign.",
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "From e-mail to show on the campaign e-mails. If left empty, the default value from settings is used.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Array of string tags to mark the campaign.",
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "A timestamp to schedule the campaign at. Eg: 2021-12-25T06:00:00 (YYYY-MM-DDTHH:MM:SS)",
      optional: true,
    },
    templateId: {
      propDefinition: [
        listmonk,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.listmonk.createCampaign({
      data: {
        name: this.name,
        subject: this.subject,
        lists: this.listIds,
        from_email: this.fromEmail,
        type: this.type,
        content_type: this.contentType,
        body: this.body,
        tags: this.tags,
        send_at: this.sendAt,
        template_id: this.templateId,
      },
      $,
    });

    if (data?.id) {
      $.export("$summary", `Successfully created campaign with ID ${data.id}.`);
    }

    return data;
  },
};
