import { clearObj } from "../../common/utils.mjs";
import mailwizz from "../../mailwizz.app.mjs";

export default {
  key: "mailwizz-create-campaign",
  name: "Create Campaign",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new campaign. [See the docs here](https://api-docs.mailwizz.com/?php#create-a-campaign)",
  type: "action",
  props: {
    mailwizz,
    name: {
      type: "string",
      label: "Name",
      description: "Campaign name.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Campaign type. Default is regular.",
      options: [
        "autoresponder",
        "regular",
      ],
      optional: true,
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "The campaign from name.",
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "The campaign from email address.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The campaign subject.",
      optional: true,
    },
    toName: {
      type: "string",
      label: "To Name",
      description: "The subscriber for which we record the bounce.",
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "RThe camapaign reply to email address.",
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "This will use the timezone which customer selected.",
    },
    listId: {
      propDefinition: [
        mailwizz,
        "listId",
      ],
    },
    segmentId: {
      propDefinition: [
        mailwizz,
        "segmentId",
        ( { listId } ) => ( {
          listId,
        } ),
      ],
      optional: true,
    },
    templateId: {
      propDefinition: [
        mailwizz,
        "templateId",
      ],
    },
    inlineCSS: {
      type: "boolean",
      label: "Inline CSS",
      description: "Accept inline css",
      optional: true,
    },
    plainText: {
      type: "string",
      label: "Plain Text",
      description: "Do not send to autogenerate as default.",
      optional: true,
    },
    autoPlainText: {
      type: "boolean",
      label: "Auto Plain Text",
      description: "Generate plain text template.",
      optional: true,
    },
    urlTracking: {
      type: "boolean",
      label: "URL Tracking",
      description: "Enable/Disable url tracking.",
      optional: true,
    },
    jsonFeed: {
      type: "boolean",
      label: "JSON Feed",
      description: "Enable/Disable JSON feed.",
      optional: true,
    },
    xmlFeed: {
      type: "boolean",
      label: "XML Feed",
      description: "Enable/Disable XML feed.",
      optional: true,
    },
    plainTextEmail: {
      type: "boolean",
      label: "Plain Text Email",
      description: "Enable/Disable the plain text email.",
      optional: true,
    },
    emailStats: {
      type: "string",
      label: "Email Stats",
      description: "A valid email address where the stats will be sent.",
      optional: true,
    },
    autoresponderEvent: {
      type: "string",
      label: "Autoresponder Event",
      description: "The event that is sent after subscribe or after opening the campaign.",
      options: [
        "AFTER-SUBSCRIBE",
        "AFTER-CAMPAIGN-OPEN",
      ],
      optional: true,
    },
    autoresponderTimeUnit: {
      type: "string",
      label: "Autoresponder Time Unit",
      description: "The unit that the autoresponder will be based on.",
      options: [
        "minute",
        "hour",
        "day",
        "week",
        "month",
        "year",
      ],
      optional: true,
    },
    autoresponderTimeValue: {
      type: "integer",
      label: "Autoresponder Time Value",
      description: "The unit time value.",
      optional: true,
    },
    autoresponderOpenCampaignId: {
      propDefinition: [
        mailwizz,
        "campaignId",
      ],
      label: "Autoresponder Open Campaign Id",
      description: "Id of the camapign, only if event is AFTER-CAMPAIGN-OPEN.",
      optional: true,
    },
    cronjob: {
      type: "string",
      label: "Cron Job",
      description: "If this campaign is advanced recurring, you can set a cron job style frequency.",
      optional: true,
    },
    cronjobEnabled: {
      type: "boolean",
      label: "Cron Job Enabled",
      description: "Enable/Disable cron job frequency.",
      optional: true,
    },
  },
  async run ( { $ } ) {
    const {
      mailwizz,
      fromName,
      fromEmail,
      toName,
      replyTo,
      sendAt,
      listId,
      segmentId,
      templateId,
      inlineCSS,
      plainText,
      autoPlainText,
      urlTracking,
      jsonFeed,
      xmlFeed,
      plainTextEmail,
      emailStats,
      autoresponderEvent,
      autoresponderTimeUnit,
      autoresponderTimeValue,
      autoresponderOpenCampaignId,
      cronjobEnabled,
      ...data
    } = this;

    const response = await mailwizz.createCampaign( clearObj( {
      data: {
        campaign: {
          ...data,
          from_name: fromName,
          from_email: fromEmail,
          to_name: toName,
          reply_to: replyTo,
          send_at: sendAt,
          list_uid: listId,
          segment_uid: segmentId,
          template: {
            template_uid: templateId,
            inline_css: inlineCSS,
            plain_text: plainText,
            auto_plain_text: autoPlainText,
          },
          options: {
            url_tracking: urlTracking || "no",
            json_feed: jsonFeed,
            xml_feed: xmlFeed,
            plain_text_email: plainTextEmail,
            email_stats: emailStats,
            autoresponder_event: autoresponderEvent,
            autoresponder_time_unit: autoresponderTimeUnit,
            autoresponder_time_value: autoresponderTimeValue,
            autoresponder_open_campaign_id: autoresponderOpenCampaignId,
            cronjob_enabled: cronjobEnabled,
          },
        },
      },
    } ) );

    $.export( "$summary", `Campaign with id ${response.campaign_uid} was successfully created!` );
    return response;
  },
};
