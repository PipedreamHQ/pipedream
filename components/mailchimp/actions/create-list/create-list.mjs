import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-create-list",
  name: "Create List",
  description: "Creates a new list. [See docs here](https://mailchimp.com/developer/marketing/api/lists/add-list/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailchimp,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the list.",
    },
    contactCompany: {
      type: "string",
      label: "Contact company",
      description: "The company name for the list.",
    },
    contactAddress1: {
      type: "string",
      label: "Contact address1",
      description: "The street address for the list contact.",
    },
    contactCity: {
      type: "string",
      label: "Contact city",
      description: "The city for the list contact.",
    },
    contactCountry: {
      type: "string",
      label: "Contact country",
      description: "A two-character ISO3166 country code. Defaults to US if invalid.",
    },
    permissionReminder: {
      type: "string",
      label: "Permission reminder",
      description: "The [permission reminder](https://mailchimp.com/help/edit-the-permission-reminder/) for the list. e.g You signed up for updates on our website",
    },
    campaignDefaultsFromName: {
      type: "string",
      label: "From name",
      description: "The default from name for campaigns sent to this list.",
    },
    campaignDefaultsFromEmail: {
      type: "string",
      label: "From email",
      description: "The default from email for campaigns sent to this list.",
    },
    campaignDefaultsSubject: {
      type: "string",
      label: "Subject",
      description: "The default subject line for campaigns sent to this list.",
    },
    campaignDefaultsLanguage: {
      type: "string",
      label: "Language",
      description: "The default language for this lists's forms.",
    },
    emailTypeOption: {
      type: "boolean",
      label: "Email type option",
      description: `Whether the list supports [multiple formats for emails](https://mailchimp.com/help/change-audience-name-defaults/).
        When set to true, subscribers can choose whether they want to receive HTML or plain-text emails. 
        When set to false, subscribers will receive HTML emails, with a plain-text alternative backup.`,
    },
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      name: this.name,
      contact: {
        country: this.contactCountry,
        city: this.contactCity,
        address1: this.contactAddress1,
        company: this.contactCompany,
      },
      permission_reminder: this.permissionReminder,
      campaign_defaults: {
        from_name: this.campaignDefaultsFromName,
        from_email: this.campaignDefaultsFromEmail,
        subject: this.campaignDefaultsSubject,
        language: this.campaignDefaultsLanguage,
      },
      email_type_option: this.emailTypeOption,
    });
    const response = await this.mailchimp.createList($, payload);
    response && $.export("$summary", "List created successfully");
    return response;
  },
};
