import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-clone-email",
  name: "Clone Marketing Email",
  description: "Clone a marketing email in HubSpot. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2Fclone)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    emailId: {
      propDefinition: [
        hubspot,
        "emailId",
      ],
    },
    cloneName: {
      type: "string",
      label: "Clone Name",
      description: "The name to assign to the cloned email",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language code for the cloned email",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.cloneEmail({
      $,
      data: {
        cloneName: this.cloneName,
        language: this.language,
        id: this.emailId,
      },
    });

    $.export("$summary", `Successfully cloned email with ID: ${response.id}`);

    return response;
  },
};
