import mailchimp from "../../mailchimp.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mailchimp-update-campaign",
  name: "Update Campaign",
  description: "Update a campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/update-campaign-settings/)",
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
    listId: {
      propDefinition: [
        mailchimp,
        "listId",
      ],
      label: "List Id",
      description: "The unique ID of the list",
    },
    savedSegmentId: {
      propDefinition: [
        mailchimp,
        "segmentId",
        (c) => ({
          listId: c.listId,
        }),
      ],
      label: "Saved segment ID",
      description: "The ID for an existing saved segment.",
      optional: true,
    },
    prebuiltSegmentId: {
      type: "string",
      label: "Prebuilt segment ID",
      description: "The prebuilt segment ID, if a prebuilt segment has been designated for this campaign.",
      optional: true,
    },
    segmentMatch: {
      type: "string",
      label: "Segment match",
      description: "Segment match type.",
      optional: true,
      options: constants.SEGMENT_MATCHES,
    },
    segmentConditions: {
      type: "any",
      label: "Segment condition",
      description: "Segment match conditions.",
      optional: true,
    },
    subjectLine: {
      type: "string",
      label: "Subject line",
      description: "The subject line for the campaign.",
      optional: true,
    },
    previewText: {
      type: "string",
      label: "Preview text",
      description: "The preview text for the campaign.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the campaign.",
      optional: true,
    },
    fromName: {
      type: "string",
      label: "From name",
      description: "The 'from' name on the campaign (not an email address).",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply to",
      description: "The reply-to email address for the campaign. Note: while this field is not required for campaign creation, it is required for sending.",
      optional: true,
    },
    useConversation: {
      type: "boolean",
      label: "Use conversations",
      description: "Use Mailchimp Conversation feature to manage out-of-office replies.",
      optional: true,
    },
    toName: {
      type: "string",
      label: "To name",
      description: "The campaign's custom 'To' name.",
      optional: true,
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "If the campaign is listed in a folder, the ID for that folder.",
      optional: true,
    },
    authenticate: {
      type: "boolean",
      label: "Authenticate",
      description: "Whether Mailchimp authenticated the campaign. Defaults to true.",
      optional: true,
    },
    autoFooter: {
      type: "boolean",
      label: "Auto footer",
      description: "Automatically append Mailchimp's default footer to the campaign.",
      optional: true,
    },
    inlineCss: {
      type: "boolean",
      label: "Inline css",
      description: "Automatically inline the CSS included with the campaign content.",
      optional: true,
    },
    autoTweet: {
      type: "boolean",
      label: "Auto tweet",
      description: "Automatically tweet a link to the campaign archive page when the campaign is sent.",
      optional: true,
    },
    autoFbPost: {
      type: "string[]",
      label: "Auto facebook post",
      description: "An array of Facebook page ID to auto-post to.",
      optional: true,
    },
    fbComments: {
      type: "boolean",
      label: "Facebook comment",
      description: "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to true.",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use.",
      optional: true,
    },
    opens: {
      type: "boolean",
      label: "Opens",
      description: "Whether to track opens. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    htmlClicks: {
      type: "boolean",
      label: "HTML clicks",
      description: "Whether to track clicks in the HTML version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    textClicks: {
      type: "boolean",
      label: "Text clicks",
      description: "Whether to track clicks in the plain-text version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    goalTracking: {
      type: "boolean",
      label: "Goal tracking",
      description: "Whether to enable Goal tracking.",
      optional: true,
    },
    ecomm360: {
      type: "boolean",
      label: "E-commerce tracking",
      description: "Whether to enable eCommerce360 tracking.",
      optional: true,
    },
    googleAnalytics: {
      type: "string",
      label: "Google analytics",
      description: "The custom slug for Google Analytics tracking (max of 50 bytes).",
      optional: true,
    },
    clicktale: {
      type: "string",
      label: "Clicktale",
      description: "The custom slug for ClickTale tracking (max of 50 bytes).",
      optional: true,
    },
    salesforceCampaign: {
      type: "boolean",
      label: "Salesforce campaign",
      description: "Create a campaign in a connected Salesforce account.",
      optional: true,
    },
    salesforceNotes: {
      type: "boolean",
      label: "Salesforce notes",
      description: "Update contact notes for a campaign based on subscriber email addresses.",
      optional: true,
    },
    capsuleNotes: {
      type: "boolean",
      label: "Capsule notes",
      description: "Update contact notes for a campaign based on subscriber email addresses. Must be using Mailchimp's built-in Capsule integration.",
      optional: true,
    },
    socialImageUrl: {
      type: "string",
      label: "Social image url",
      description: "The url for the header image for the preview card.",
      optional: true,
    },
    socialDescritpion: {
      type: "string",
      label: "Social description",
      description: "A short summary of the campaign to display.",
      optional: true,
    },
    socialTitle: {
      type: "string",
      label: "Social title",
      description: "The title for the preview card. Typically the subject line of the campaign.",
      optional: true,
      options: constants.SOCIAL_TITLES,
    },
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      campaignId: this.campaignId,
      recipients: {
        list_id: this.listId,
        segment_ops: {
          saved_segment_id: this.savedSegmentId,
          prebuilt_segment_id: this.prebuiltSegmentId,
          match: this.segmentMatch,
          conditions: this.segmentConditions,
        },
      },
      settings: {
        subject_line: this.subjectLine,
        preview_text: this.previewText,
        title: this.title,
        from_name: this.fromName,
        reply_to: this.replyTo,
        use_conversation: this.useConversation,
        to_name: this.toName,
        folder_id: this.folderId,
        authenticate: this.authenticate,
        auto_footer: this.autoFooter,
        inline_css: this.inlineCss,
        auto_tweet: this.autoTweet,
        auto_fb_post: this.autoFbPost,
        fb_comments: this.fbComments,
        template_id: this.templateId && Number(this.templateId),
      },
      tracking: {
        opens: this.opens,
        html_clicks: this.htmlClicks,
        text_clicks: this.textClicks,
        goal_tracking: this.goalTracking,
        ecomm360: this.ecomm360,
        google_analytics: this.googleAnalytics,
        clicktale: this.clicktale,
        salesforce: {
          campaign: this.salesforceCampaign,
          notes: this.salesforceNotes,
        },
        capsule: {
          notes: this.capsuleNotes,
        },
      },
      social_card: {
        image_url: this.socialImageUrl,
        description: this.socialDescritpion,
        title: this.socialTitle,
      },
    });
    const response = await this.mailchimp.updateCampaign($, payload);
    response && $.export("$summary", "Campaign updated successfully");
    return response;
  },
};
