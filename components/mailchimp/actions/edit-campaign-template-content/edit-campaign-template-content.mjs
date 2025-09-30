import mailchimp from "../../mailchimp.app.mjs";
import {
  formatArrayStrings, removeNullEntries,
} from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mailchimp-edit-campaign-template-content",
  name: "Edit A Campaign Template Content",
  description: "Edits a defined content area of a custom HTML template. [See docs here](https://mailchimp.com/developer/marketing/api/campaign-content/set-campaign-content/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailchimp,
    campaignId: {
      propDefinition: [
        mailchimp,
        "campaignId",
      ],
    },
    archiveType: {
      type: "string",
      label: "Archive type",
      description: "The type of encoded file.",
      optional: true,
      options: constants.ARCHIVE_TYPES,
    },
    templateSections: {
      type: "object",
      label: "Template sections",
      description: "Content for the sections of the template. Each key should be the unique mc:edit area name from the template.",
      optional: true,
      reloadProps: true,
    },
    plainText: {
      type: "string",
      label: "Plain text",
      description: "The plain-text portion of the campaign. If left unspecified, we'll generate this automatically.",
      optional: true,
    },
    html: {
      type: "string",
      label: "Plain text",
      description: "The plain-text portion of the campaign. If left unspecified, we'll generate this automatically.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "When importing a campaign, the URL where the HTML lives.",
      optional: true,
    },
    variateContents: {
      type: "string[]",
      label: "Variate contents",
      optional: true,
      description: `Stringified object list of content options for [Multivariate Campaigns](https://mailchimp.com/help/about-multivariate-campaigns/). 
      Allowed keys are archive, template, content_label, plain_text, html, and url.
        Each content option must provide HTML content and may optionally provide plain text. 
        For campaigns not testing content, only one object should be provided.`,
    },
  },
  additionalProps() {
    const props = {};
    if (Object.keys(this.templateSections).length > 0) {
      props.templateId = {
        type: "string",
        label: "Template ID",
        description: "The ID of the template to use.",
      };
    }
    if (this.archiveType && this.archiveType !== "zip") {
      props.archiveContent = {
        type: "string",
        label: "Archive content",
        description: "The base64-encoded representation of the archive file",
      };
    }
    return props;
  },
  async run({ $ }) {

    const payload = removeNullEntries({
      campaignId: this.campaignId,
      archive: {
        archive_content: this.archiveContent,
        archive_type: this.archiveType,
      },
      plain_text: this.plainText,
      html: this.html,
      url: this.url,
      template: {
        sections: this.templateSections,
        id: this.templateId,
      },
      variate_contents: formatArrayStrings(this.variateContents, constants.ALLOWED_VARIATE_CONTENTS, "Variate contents"),
    });
    const response = await this.mailchimp.editCampaignTemplate($, payload);
    response && $.export("$summary", "Campaign template updated successfully");
    return response;
  },
};
