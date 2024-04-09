import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendy",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list you want to subscribe a user to or unsubscribe from.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The subscriber's name.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The subscriber's country (2-letter code).",
      optional: true,
    },
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
    htmlText: {
      type: "string",
      label: "HTML Text",
      description: "The 'HTML version' of your campaign.",
    },
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The 'Brand ID' required if you are creating a 'Draft' campaign.",
    },
    trackOpens: {
      type: "string",
      label: "Track Opens",
      description: "Set to '0' to disable, '1' to enable open tracking.",
    },
    trackClicks: {
      type: "string",
      label: "Track Clicks",
      description: "Set to '0' to disable, '1' to enable click tracking.",
    },
    plainText: {
      type: "string",
      label: "Plain Text",
      description: "The 'Plain text version' of your campaign.",
      optional: true,
    },
    listIds: {
      type: "string",
      label: "List IDs",
      description: "List IDs should be single or comma-separated.",
      optional: true,
    },
    segmentIds: {
      type: "string",
      label: "Segment IDs",
      description: "Segment IDs should be single or comma-separated.",
      optional: true,
    },
    excludeListIds: {
      type: "string",
      label: "Exclude List IDs",
      description: "Lists to exclude from your campaign.",
      optional: true,
    },
    excludeSegmentIds: {
      type: "string",
      label: "Exclude Segment IDs",
      description: "Segments to exclude from your campaign.",
      optional: true,
    },
    queryString: {
      type: "string",
      label: "Query String",
      description: "e.g., Google Analytics tags.",
      optional: true,
    },
    scheduleDateTime: {
      type: "string",
      label: "Schedule Date Time",
      description: "Format: June 15, 2021 6:05pm. Minutes in increments of 5.",
      optional: true,
    },
    scheduleTimezone: {
      type: "string",
      label: "Schedule Timezone",
      description: "e.g., 'America/New_York'.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "http://your_sendy_installation";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async addOrUpdateSubscriber({
      listId, email, name, country, ...otherOpts
    }) {
      return this._makeRequest({
        path: "/subscribe",
        data: {
          list: listId,
          email,
          name,
          country,
          ...otherOpts,
        },
      });
    },
    async createDraftCampaign({
      fromName,
      fromEmail,
      replyTo,
      title,
      subject,
      htmlText,
      brandId,
      trackOpens,
      trackClicks,
      plainText,
      listIds,
      segmentIds,
      excludeListIds,
      excludeSegmentIds,
      queryString,
      scheduleDateTime,
      scheduleTimezone,
      ...otherOpts
    }) {
      return this._makeRequest({
        path: "/api/campaigns/create.php",
        data: {
          from_name: fromName,
          from_email: fromEmail,
          reply_to: replyTo,
          title,
          subject,
          html_text: htmlText,
          brand_id: brandId,
          track_opens: trackOpens,
          track_clicks: trackClicks,
          plain_text: plainText,
          list_ids: listIds,
          segment_ids: segmentIds,
          exclude_list_ids: excludeListIds,
          exclude_segments_ids: excludeSegmentIds,
          query_string: queryString,
          schedule_date_time: scheduleDateTime,
          schedule_timezone: scheduleTimezone,
          send_campaign: 1,
          ...otherOpts,
        },
      });
    },
    async removeSubscriber({
      listId, email,
    }) {
      return this._makeRequest({
        path: "/api/subscribers/delete.php",
        data: {
          list_id: listId,
          email,
        },
      });
    },
  },
};
