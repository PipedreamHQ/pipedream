import { ConfigurationError } from "@pipedream/platform";
import { clearEmpty } from "../../common/utils.mjs";
import selzy from "../../selzy.app.mjs";

export default {
  key: "selzy-create-campaign",
  name: "Create Campaign",
  description: "Creates a new campaign. [See the documentation](https://selzy.com/en/support/api/messages/createcampaign/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    selzy,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "Code of the message to be sent. The code returned by the **Create Email Message** method should be transferred.",
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Campaign launch date and time in the \"YYYY-MM-DD hh:mm\" format, which do not exceed 100 days from the current date. If the argument is not set, the campaign starts immediately. The time zone specified in the settings of the user's personal account is applied. To explicitly specify a time zone, use the **Timezone** argument. To provide additional error protection, you should not schedule two sendings of the same message within an hour.",
      optional: true,
    },
    trackRead: {
      type: "boolean",
      label: "Track Read",
      description: "Whether to track the fact of reading the email message. The default value is `false` (do not track). If `true`, a link to a small image tracking the reference will be added to the email. The **Track Read** argument is ignored for SMS messages.",
      optional: true,
    },
    trackLinks: {
      type: "boolean",
      label: "Track Links",
      description: "To track whether there are any click-throughs in email messages, the default value is `false` (do not track). If `true`, all external links will be replaced with special ones that allow you to track the fact of a click-through, and then forward the user to the desired page. The **Track Links** argument is ignored for SMS messages.",
      optional: true,
    },
    contactsUrl: {
      type: "string",
      label: "Contacts URL",
      description: "Instead of the contacts parameter containing the actual email addresses or phone numbers, in this parameter you can specify the URL of the file from which the addresses (phone numbers) will be read. The URL must start with \"http://\", \"https://\" or \"ftp://\". The file must contain one contact per string, without commas; strings must be separated by \"n\" or \"rn\" (Mac format — only \"r\" — not supported). The file can be deleted after the campaign has shifted to the 'scheduled' status.",
      optional: true,
    },
    trackGa: {
      type: "boolean",
      label: "Track GA",
      description: "Whether to enable Google Analytics integration for this campaign. Only explicitly indicated values are valid, default usage parameters are not applied. The default value is `false` (disabled).",
      optional: true,
      reloadProps: true,
    },
    gaMedium: {
      type: "string",
      label: "GA Medium",
      description: "Integration parameters with Google Analytics (valid if track_ga=1). Only explicitly indicated values are valid, default usage parameters are not applied.",
      optional: true,
      hidden: true,
    },
    gaSource: {
      type: "string",
      label: "GA Source",
      description: "Integration parameters with Google Analytics (valid if track_ga=1). Only explicitly indicated values are valid, default usage parameters are not applied.",
      optional: true,
      hidden: true,
    },
    gaCampaign: {
      type: "string",
      label: "GA Campaign",
      description: "Integration parameters with Google Analytics (valid if track_ga=1). Only explicitly indicated values are valid, default usage parameters are not applied.",
      optional: true,
      hidden: true,
    },
    gaContent: {
      type: "string",
      label: "GA Content",
      description: "Integration parameters with Google Analytics (valid if track_ga=1). Only explicitly indicated values are valid, default usage parameters are not applied.",
      optional: true,
      hidden: true,
    },
    gaTerm: {
      type: "string",
      label: "GA Term",
      description: "Integration parameters with Google Analytics (valid if track_ga=1). Only explicitly indicated values are valid, default usage parameters are not applied.",
      optional: true,
      hidden: true,
    },
  },
  async additionalProps(props) {
    const gaAllowed = this.trackGa;
    props.gaMedium.hidden = !gaAllowed;
    props.gaSource.hidden = !gaAllowed;
    props.gaCampaign.hidden = !gaAllowed;
    props.gaContent.hidden = !gaAllowed;
    props.gaTerm.hidden = !gaAllowed;

    return {};
  },
  async run({ $ }) {
    if (this.contacts && this.contactsUrl) {
      throw new ConfigurationError("You can't set both contacts and contactsUrl parameters at the same time");
    }

    const response = await this.selzy.createCampaign({
      $,
      params: clearEmpty({
        message_id: this.messageId,
        start_time: this.startTime,
        track_read: this.trackRead
          ? 1
          : 0,
        track_links: this.trackLinks
          ? 1
          : 0,
        contacts_url: this.contactsUrl,
        track_ga: this.trackGa && +this.trackGa,
        ga_medium: this.gaMedium,
        ga_source: this.gaSource,
        ga_campaign: this.gaCampaign,
        ga_content: this.gaContent,
        ga_term: this.gaTerm,
      }),
    });

    if (response.error) throw new ConfigurationError(response.error);

    $.export("$summary", `Successfully created email campaign with ID: ${response.result.campaign_id}`);
    return response;
  },
};
