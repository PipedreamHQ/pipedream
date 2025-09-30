import mailchimp from "../../mailchimp.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mailchimp-create-campaign",
  name: "Create Campaign",
  description: "Creates a new campaign draft. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/add-campaign/)",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailchimp,
    type: {
      label: "Type",
      type: "string",
      description: "There are four types of campaigns you can create in Mailchimp. A/B Split campaigns have been deprecated and variate campaigns should be used instead.",
      options: constants.CAMPAIGN_TYPE,
    },
    listId: {
      propDefinition: [
        mailchimp,
        "listId",
      ],
      label: "List Id",
      description: "The unique ID of the list",
    },
    savedSegmentId: {
      label: "Saved segment ID",
      type: "integer",
      description: "The ID for an existing saved segment.",
      optional: true,
    },
    prebuiltSegmentId: {
      label: "Prebuilt segment ID",
      type: "string",
      description: "The prebuilt segment ID, if a prebuilt segment has been designated for this campaign.",
      optional: true,
    },
    segmentMatch: {
      label: "Segment match",
      type: "string",
      description: "Segment match type.",
      optional: true,
      options: [
        "any",
        "all",
      ],
    },
    segmentConditions: {
      label: "Segment conditions",
      type: "any",
      description: "Segment match conditions.",
      optional: true,
    },
    subjectLine: {
      label: "Subject line",
      type: "string",
      description: "The subject line for the campaign.",
      optional: true,
    },
    previewText: {
      label: "Preview text",
      type: "string",
      description: "The preview text for the campaign.",
      optional: true,
    },
    title: {
      label: "Title",
      type: "string",
      description: "The title of the campaign.",
      optional: true,
    },
    fromName: {
      label: "From name",
      type: "string",
      description: "The 'from' name on the campaign (not an email address).",
      optional: true,
    },
    replyTo: {
      label: "Reply to",
      type: "string",
      description: "The reply-to email address for the campaign. Note: while this field is not required for campaign creation, it is required for sending.",
      optional: true,
    },
    useConversation: {
      label: "Use conversation",
      type: "boolean",
      description: "Use Mailchimp Conversation feature to manage out-of-office replies.",
      optional: true,
    },
    toName: {
      label: "To name",
      type: "string",
      description: "The campaign's custom to name.",
      optional: true,
    },
    folderId: {
      label: "Folder ID",
      type: "string",
      description: "If the campaign is listed in a folder, the ID for that folder.",
      optional: true,
    },
    authenticate: {
      label: "Authenticate",
      type: "boolean",
      description: "Whether Mailchimp authenticated the campaign. Defaults to true.",
      optional: true,
    },
    autoFooter: {
      label: "Auto footer",
      type: "boolean",
      description: "Automatically append Mailchimp's default footer to the campaign.",
      optional: true,
    },
    inlineCss: {
      label: "Inline css",
      type: "boolean",
      description: "Automatically inline the CSS included with the campaign content.",
      optional: true,
    },
    autoTweet: {
      label: "Auto tweet",
      type: "boolean",
      description: "Automatically tweet a link to the campaign archive page when the campaign is sent.",
      optional: true,
    },
    autoFbPost: {
      label: "Auto fb post",
      type: "any",
      description: "An array of Facebook page ID to auto-post to.",
      optional: true,
    },
    fbComments: {
      label: "FB comments",
      type: "boolean",
      description: "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to true.",
      optional: true,
    },
    templateId: {
      label: "Template ID",
      type: "integer",
      description: "The ID of the template to use.",
      optional: true,
    },
    opens: {
      label: "Opens",
      type: "boolean",
      description: "Whether to track opens. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    htmlClicks: {
      label: "HTML clicks",
      type: "boolean",
      description: "Whether to track clicks in the HTML version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    textClicks: {
      label: "Text clicks",
      type: "boolean",
      description: "Whether to track clicks in the plain-text version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    goalTracking: {
      label: "Goal tracking",
      type: "boolean",
      description: "Whether to enable Goal tracking.",
      optional: true,
    },
    ecomm360: {
      label: "E-commerce tracking",
      type: "boolean",
      description: "Whether to enable eCommerce360 tracking.",
      optional: true,
    },
    googleAnalytics: {
      label: "Google analytics",
      type: "string",
      description: "The custom slug for Google Analytics tracking (max of 50 bytes).",
      optional: true,
    },
    clicktale: {
      label: "Clicktale",
      type: "string",
      description: "The custom slug for ClickTale tracking (max of 50 bytes).",
      optional: true,
    },
    salesforceCampaign: {
      label: "Salesforce campaign",
      type: "boolean",
      description: "Create a campaign in a connected Salesforce account.",
      optional: true,
    },
    salesforceNotes: {
      label: "Salesforce notes",
      type: "boolean",
      description: "Update contact notes for a campaign based on subscriber email addresses.",
      optional: true,
    },
    capsuleNotes: {
      label: "Capsule notes",
      type: "boolean",
      description: "Update contact notes for a campaign based on subscriber email addresses. Must be using Mailchimp's built-in Capsule integration.",
      optional: true,
    },
    socialImageUrl: {
      label: "Social image url",
      type: "string",
      description: "The url for the header image for the preview card.",
      optional: true,
    },
    socialDescritpion: {
      label: "Social description",
      type: "string",
      description: "A short summary of the campaign to display.",
      optional: true,
    },
    socialTitle: {
      label: "Social title",
      type: "string",
      description: "The title for the preview card. Typically the subject line of the campaign.",
      optional: true,
      options: [
        "active",
        "inactive",
      ],
    },
  },
  async run({ $ }) {

    const payload = removeNullEntries({
      "type": this.type,
      "recipients": {
        "list_id": this.listId,
        "segment_ops": {
          "saved_segment_id": this.savedSegmentId,
          "prebuilt_segment_id": this.prebuiltSegmentId,
          "match": this.segmentMatch,
          "conditions": this.segmentConditions,
        },
      },
      "settings": {
        "subject_line": this.subjectLine,
        "preview_text": this.previewText,
        "title": this.title,
        "from_name": this.fromName,
        "reply_to": this.replyTo,
        "use_conversation": this.useConversation,
        "to_name": this.toName,
        "folder_id": this.folderId,
        "authenticate": this.authenticate,
        "auto_footer": this.autoFooter,
        "inline_css": this.inlineCss,
        "auto_tweet": this.autoTweet,
        "auto_fb_post": this.autoFbPost,
        "fb_comments": this.fbComments,
        "template_id": this.templateId,
      },
      "tracking:": {
        "opens": this.opens,
        "html_clicks": this.htmlClicks,
        "text_clicks": this.textClicks,
        "goal_tracking": this.goalTracking,
        "ecomm360": this.ecomm360,
        "google_analytics": this.googleAnalytics,
        "clicktale": this.clicktale,
        "salesforce": {
          "campaign": this.salesforceCampaign,
          "notes": this.salesforceNotes,
        },
        "capsule": {
          "notes": this.capsuleNotes,
        },
      },
      "social_card": {
        "image_url": this.socialImageUrl,
        "description": this.socialDescritpion,
        "title": this.socialTitle,
      },
    });

    const response = await this.mailchimp.createCampaign($, payload);
    response && $.export("$summary", "Campaign created successfully");
    return response;

  },
};
