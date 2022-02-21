// legacy_hash_id: a_vgi8lg
import { axios } from "@pipedream/platform";

export default {
  key: "mailchimp-create-campaign",
  name: "Create Campaign",
  description: "Creates a new campaign draft.",
  version: "0.2.1",
  type: "action",
  props: {
    mailchimp: {
      type: "app",
      app: "mailchimp",
    },
    type: {
      type: "string",
      description: "There are four types of campaigns you can create in Mailchimp. A/B Split campaigns have been deprecated and variate campaigns should be used instead.",
      options: [
        "regular",
        "plaintext",
        "absplit",
        "rss",
        "variate",
      ],
    },
    list_id: {
      type: "string",
      description: "The unique list id.",
    },
    saved_segment_id: {
      type: "integer",
      description: "The id for an existing saved segment.",
      optional: true,
    },
    prebuilt_segment_id: {
      type: "string",
      description: "The prebuilt segment id, if a prebuilt segment has been designated for this campaign.",
      optional: true,
    },
    segment_match: {
      type: "string",
      description: "Segment match type.",
      optional: true,
      options: [
        "any",
        "all",
      ],
    },
    segment_conditions: {
      type: "any",
      description: "Segment match conditions.",
      optional: true,
    },
    subject_line: {
      type: "string",
      description: "The subject line for the campaign.",
      optional: true,
    },
    preview_text: {
      type: "string",
      description: "The preview text for the campaign.",
      optional: true,
    },
    title: {
      type: "string",
      description: "The title of the campaign.",
      optional: true,
    },
    from_name: {
      type: "string",
      description: "The 'from' name on the campaign (not an email address).",
      optional: true,
    },
    reply_to: {
      type: "string",
      description: "The reply-to email address for the campaign. Note: while this field is not required for campaign creation, it is required for sending.",
      optional: true,
    },
    use_conversation: {
      type: "boolean",
      description: "Use Mailchimp Conversation feature to manage out-of-office replies.",
      optional: true,
    },
    to_name: {
      type: "string",
      description: "The campaign's custom 'To' name.",
      optional: true,
    },
    folder_id: {
      type: "string",
      description: "If the campaign is listed in a folder, the id for that folder.",
      optional: true,
    },
    authenticate: {
      type: "boolean",
      description: "Whether Mailchimp authenticated the campaign. Defaults to true.",
      optional: true,
    },
    auto_footer: {
      type: "boolean",
      description: "Automatically append Mailchimp's default footer to the campaign.",
      optional: true,
    },
    inline_css: {
      type: "boolean",
      description: "Automatically inline the CSS included with the campaign content.",
      optional: true,
    },
    auto_tweet: {
      type: "boolean",
      description: "Automatically tweet a link to the campaign archive page when the campaign is sent.",
      optional: true,
    },
    auto_fb_post: {
      type: "any",
      description: "An array of Facebook page ids to auto-post to.",
      optional: true,
    },
    fb_comments: {
      type: "boolean",
      description: "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to true.",
      optional: true,
    },
    template_id: {
      type: "integer",
      description: "The id of the template to use.",
      optional: true,
    },
    opens: {
      type: "boolean",
      description: "Whether to track opens. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    html_clicks: {
      type: "boolean",
      description: "Whether to track clicks in the HTML version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    text_clicks: {
      type: "boolean",
      description: "Whether to track clicks in the plain-text version of the campaign. Defaults to true. Cannot be set to false for variate campaigns.",
      optional: true,
    },
    goal_tracking: {
      type: "boolean",
      description: "Whether to enable Goal tracking.",
      optional: true,
    },
    ecomm360: {
      type: "boolean",
      description: "Whether to enable eCommerce360 tracking.",
      optional: true,
    },
    google_analytics: {
      type: "string",
      description: "The custom slug for Google Analytics tracking (max of 50 bytes).",
      optional: true,
    },
    clicktale: {
      type: "string",
      description: "The custom slug for ClickTale tracking (max of 50 bytes).",
      optional: true,
    },
    salesforce_campaign: {
      type: "boolean",
      description: "Create a campaign in a connected Salesforce account.",
      optional: true,
    },
    salesforce_notes: {
      type: "boolean",
      description: "Update contact notes for a campaign based on subscriber email addresses.",
      optional: true,
    },
    capsule_notes: {
      type: "boolean",
      description: "Update contact notes for a campaign based on subscriber email addresses. Must be using Mailchimp's built-in Capsule integration.",
      optional: true,
    },
    social_image_url: {
      type: "string",
      description: "The url for the header image for the preview card.",
      optional: true,
    },
    social_descritpion: {
      type: "string",
      description: "A short summary of the campaign to display.",
      optional: true,
    },
    social_title: {
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
    return await axios($, {
      url: `https://${this.mailchimp.$auth.dc}.api.mailchimp.com/3.0/campaigns`,
      headers: {
        Authorization: `Bearer ${this.mailchimp.$auth.oauth_access_token}`,
      },
      method: "POST",
      data: {
        "type": this.type,
        "recipients": {
          "list_id": this.list_id,
          "segment_ops": {
            "saved_segment_id": this.saved_segment_id,
            "prebuilt_segment_id": this.prebuilt_segment_id,
            "match": this.segment_match,
            "conditions": this.segment_conditions,
          },
        },
        "settings": {
          "subject_line": this.subject_line,
          "preview_text": this.preview_text,
          "title": this.title,
          "from_name": this.from_name,
          "reply_to": this.reply_to,
          "use_conversation": this.use_conversation,
          "to_name": this.to_name,
          "folder_id": this.folder_id,
          "authenticate": this.authenticate,
          "auto_footer": this.auto_footer,
          "inline_css": this.inline_css,
          "auto_tweet": this.auto_tweet,
          "auto_fb_post": this.auto_fb_post,
          "fb_comments": this.fb_comments,
          "template_id": this.template_id,
        },
        "tracking:": {
          "opens": this.opens,
          "html_clicks": this.html_clicks,
          "text_clicks": this.text_clicks,
          "goal_tracking": this.goal_tracking,
          "ecomm360": this.ecomm360,
          "google_analytics": this.google_analytics,
          "clicktale": this.clicktale,
          "salesforce": {
            "campaign": this.salesforce_campaign,
            "notes": this.salesforce_notes,
          },
          "capsule": {
            "notes": this.capsule_notes,
          },
        },
        "social_card": {
          "image_url": this.social_image_url,
          "description": this.social_descritpion,
          "title": this.social_title,
        },
      },
    });
  },
};
