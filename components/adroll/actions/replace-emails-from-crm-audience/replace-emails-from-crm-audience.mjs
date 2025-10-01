import app from "../../adroll.app.mjs";

export default {
  key: "adroll-replace-emails-from-crm-audience",
  name: "Replace Emails from CRM Audience",
  description: "Replace the email list from a CRM audience in AdRoll. [See docs here](https://developers.adroll.com/docs/adroll-audience-api/1/routes/segments/%7Bsegment_eid%7D/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    audienceId: {
      propDefinition: [
        app,
        "audienceId",
        (c) => ({
          advertiserId: c.advertiserId,
        }),
      ],
    },
    emailList: {
      label: "Email List",
      description: "The email address list to replace in the CRM audience. List must contain at least 100 unique emails. [See docs here](https://help.adroll.com/hc/en-us/articles/211845528-CRM-Audience)",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const {
      emailList,
      audienceId,
    } = this;

    const response = await this.app.replaceEmailsFromCRMAudience({
      $,
      emails: Array.isArray(emailList) && emailList || JSON.parse(emailList),
      audienceId,
    });

    $.export("$summary", `Successfully updated email address list from CRM audience with ID: "${audienceId}"`);

    return response;
  },
};
