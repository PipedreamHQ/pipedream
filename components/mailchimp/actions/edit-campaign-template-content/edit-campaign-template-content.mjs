import { ConfigurationError } from "@pipedream/platform";
import mailchimp from "../../mailchimp.app.mjs";
import {
  formatArrayStrings, removeNullEntries,
} from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mailchimp-edit-campaign-template-content",
  name: "Edit A Campaign Template Content",
  description: "Edits a defined content area of a custom HTML template. [See docs here](https://mailchimp.com/developer/marketing/api/campaign-content/set-campaign-content/)",
  version: "0.0.5",
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
    archiveContent: {
      type: "string",
      label: "Archive content",
      description: "The base64-encoded representation of the archive file, e.g. `UEsDBBQAAAAIAAAAIQ...`. Use together with **Archive type**.",
      optional: true,
    },
    templateSections: {
      type: "object",
      label: "Template sections",
      description: "Content for the sections of the template. Each key should be the unique mc:edit area name from the template, e.g. `{\"body\": \"<p>Hello</p>\"}`.",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The numeric ID of the template to use, e.g. `12345`. Use the **List Templates** tool and take the `id` of the template in `templates`. Required when **Template sections** is set.",
      optional: true,
    },
    plainText: {
      type: "string",
      label: "Plain text",
      description: "The plain-text portion of the campaign. If left unspecified, we'll generate this automatically.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The raw HTML for the campaign, e.g. `<html><body><p>Hello</p></body></html>`.",
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
  async run({ $ }) {
    if (this.templateSections && Object.keys(this.templateSections).length && !this.templateId) {
      throw new ConfigurationError("**Template ID** is required when **Template sections** is set.");
    }
    if (this.archiveType && !this.archiveContent) {
      throw new ConfigurationError("**Archive content** is required when **Archive type** is set.");
    }
    const rawTemplateId = this.templateId?.toString().trim();
    const templateId = rawTemplateId
      ? Number(rawTemplateId)
      : undefined;
    // `this.templateId` is checked (not `templateId`) so a blank value like " " is rejected too
    if (this.templateId && (!Number.isInteger(templateId) || templateId <= 0)) {
      throw new ConfigurationError("**Template ID** must be a positive whole number.");
    }

    const payload = removeNullEntries({
      campaignId: this.campaignId,
      // Mailchimp requires archive_content whenever `archive` is present
      archive: this.archiveContent
        ? {
          archive_content: this.archiveContent,
          archive_type: this.archiveType,
        }
        : undefined,
      plain_text: this.plainText,
      html: this.html,
      url: this.url,
      // Mailchimp requires id whenever `template` is present
      template: templateId
        ? {
          id: templateId,
          sections: this.templateSections,
        }
        : undefined,
      variate_contents: formatArrayStrings(this.variateContents, constants.ALLOWED_VARIATE_CONTENTS, "Variate contents"),
    });
    const response = await this.mailchimp.editCampaignTemplate($, payload);
    response && $.export("$summary", "Campaign template updated successfully");
    return response;
  },
};
