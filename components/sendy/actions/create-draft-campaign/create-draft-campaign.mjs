import { parseObject } from "../../common/utils.mjs";
import sendy from "../../sendy.app.mjs";

export default {
  key: "sendy-create-draft-campaign",
  name: "Create Draft Campaign",
  description: "Creates a new draft campaign ready to be filled in with details. [See the documentation](https://sendy.co/api?app_path=https://sendy.email/dev2#create-send-campaigns)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendy,
    fromName: {
      type: "string",
      label: "From Name",
      description: "The 'From Name' of your campaign.",
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "The 'From Email' of your campaign.",
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "The 'Reply To' of your campaign.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The 'Title' of your campaign.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The 'Subject' of your campaign.",
    },
    plainText: {
      type: "string",
      label: "Plain Text",
      description: "The 'Plain text version' of your campaign.",
      optional: true,
    },
    htmlText: {
      type: "string",
      label: "HTML Text",
      description: "The 'HTML version' of your campaign.",
    },
    brandId: {
      propDefinition: [
        sendy,
        "brandId",
      ],
    },
    listIds: {
      propDefinition: [
        sendy,
        "listId",
        ({ brandId }) => ({
          brandId,
        }),
      ],
      type: "string[]",
      label: "List IDs",
      description: "A list of List IDs.",
      optional: true,
    },
    segmentIds: {
      type: "string[]",
      label: "Segment IDs",
      description: "A list of segment IDs. Segment ids can be found in the segments setup page.",
      optional: true,
    },
    excludeListIds: {
      propDefinition: [
        sendy,
        "listId",
        ({ brandId }) => ({
          brandId,
        }),
      ],
      type: "string[]",
      label: "Exclude List IDs",
      description: "Lists to exclude from your campaign.",
      optional: true,
    },
    excludeSegmentIds: {
      type: "string[]",
      label: "Exclude Segment IDs",
      description: "Segments to exclude from your campaign. Segment ids can be found in the segments setup page.",
      optional: true,
    },
    queryString: {
      type: "string",
      label: "Query String",
      description: "e.g., Google Analytics tags.",
      optional: true,
    },
    trackOpens: {
      type: "string",
      label: "Track Opens",
      description: "Open tracking behaviour.",
      options: [
        {
          label: "Disabled",
          value: "0",
        },
        {
          label: "Enabled",
          value: "1",
        },
        {
          label: "Anonymous",
          value: "2",
        },
      ],
    },
    trackClicks: {
      type: "string",
      label: "Track Clicks",
      description: "Click tracking behaviour.",
      options: [
        {
          label: "Disabled",
          value: "0",
        },
        {
          label: "Enabled",
          value: "1",
        },
        {
          label: "Anonymous",
          value: "2",
        },
      ],
    },
    scheduleDateTime: {
      type: "string",
      label: "Schedule Date Time",
      description: "Format: June 15, 2021 6:05pm. Minutes in increments of '5', eg. 6pm, 6:05pm, 6:10pm, 6:15pm..",
      optional: true,
    },
    scheduleTimezone: {
      type: "string",
      label: "Schedule Timezone",
      description: "e.g., 'America/New_York'. See the [list of PHP's supported timezones](https://www.php.net/manual/en/timezones.php). This parameter only applies if you're scheduling your campaign with 'Schedule Date Time' parameter. Sendy will use your default timezone if this parameter is empty.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sendy.createDraftCampaign({
      $,
      data: {
        from_name: this.fromName,
        from_email: this.fromEmail,
        reply_to: this.replyTo,
        title: this.title,
        subject: this.subject,
        plain_text: this.plainText,
        html_text: this.htmlText,
        list_ids: this.listIds && parseObject(this.listIds),
        segment_ids: this.segmentIds && parseObject(this.segmentIds),
        exclude_list_ids: this.excludeListIds && parseObject(this.excludeListIds),
        exclude_segment_ids: this.excludeSegmentIds && parseObject(this.excludeSegmentIds),
        brand_id: this.brandId,
        query_string: this.queryString,
        track_opens: this.trackOpens,
        track_clicks: this.trackClicks,
        schedule_date_time: this.scheduleDateTime,
        schedule_timezone: this.scheduleTimezone,
      },
    });

    $.export("$summary", "Draft campaign created successfully");
    return response;
  },
};
