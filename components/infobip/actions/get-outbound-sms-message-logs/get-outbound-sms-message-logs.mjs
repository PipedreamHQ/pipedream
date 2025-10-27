import infobip from "../../infobip.app.mjs";

export default {
  key: "get-outbound-sms-message-logs",
  name: "Get Outbound SMS Message Logs",
  description:
    "Get outbound SMS message logs Use this method for displaying logs for example in the user interface. Available are the logs for the last 48 hours and you can only retrieve maximum of 1000 logs per ... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    from: {
      type: "string",
      label: "From",
      description: "The sender ID which can be alphanumeric or numeric.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Message destination address.",
      optional: true,
    },
    bulkId: {
      type: "string",
      label: "Bulk Id",
      description: "Unique ID assigned to the request if messaging multiple recipients or sending multiple messages via a single API request. May contain multiple comma-separated values. Maximum length 2048 characters.",
      optional: true,
    },
    messageId: {
      type: "string",
      label: "Message Id",
      description: "Unique message ID for which a log is requested. May contain multiple comma-separated values. Maximum length 2048 characters.",
      optional: true,
    },
    generalStatus: {
      type: "string",
      label: "General Status",
      description: "Sent [message status](https://www.infobip.com/docs/essentials/response-status-and-error-codes#api-status-codes).",
      optional: true,
    },
    sentSince: {
      type: "string",
      label: "Sent Since",
      description: "The logs will only include messages sent after this date. Use it alongside `sentUntil` to specify a time range for the logs, but only up to the maximum limit of 1000 logs per call. Has the following format: `yyyy-MM-dd'T'HH:mm:ss.SSSZ`.",
      optional: true,
    },
    sentUntil: {
      type: "string",
      label: "Sent Until",
      description: "The logs will only include messages sent before this date. Use it alongside `sentSince` to specify a time range for the logs, but only up to the maximum limit of 1000 logs per call. Has the following format: `yyyy-MM-dd'T'HH:mm:ss.SSSZ`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to include in logs. If not set, the latest 50 records are returned. Maximum limit value is `1000` and you can only access logs for the last 48h.",
      optional: true,
    },
    mcc: {
      type: "string",
      label: "Mcc",
      description: "Mobile Country Code.",
      optional: true,
    },
    mnc: {
      type: "string",
      label: "Mnc",
      description: "Mobile Network Code. Mobile Country Code is required if this property is used. ",
      optional: true,
    },
    applicationId: {
      type: "string",
      label: "Application Id",
      description: "Application id used to send the message. For more details, see our [documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      optional: true,
    },
    entityId: {
      type: "string",
      label: "Entity Id",
      description: "Entity id used to send the message. For more details, see our [documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      optional: true,
    },
    campaignReferenceId: {
      type: "string",
      label: "Campaign Reference Id",
      description: "ID of a campaign that was sent in the message. May contain multiple comma-separated values.",
      optional: true,
    }
  },
  async run({ $ }) {
    const { infobip, from, to, bulkId, messageId, generalStatus, sentSince, sentUntil, limit, mcc, mnc, applicationId, entityId, campaignReferenceId, ...params } = this;

    const pathQuery = [];
    if (from !== undefined && from !== null) pathQuery.push({ name: "from", value: from.toString() });
    if (to !== undefined && to !== null) pathQuery.push({ name: "to", value: to.toString() });
    if (bulkId !== undefined && bulkId !== null) pathQuery.push({ name: "bulkId", value: bulkId.toString() });
    if (messageId !== undefined && messageId !== null) pathQuery.push({ name: "messageId", value: messageId.toString() });
    if (generalStatus !== undefined && generalStatus !== null) pathQuery.push({ name: "generalStatus", value: generalStatus.toString() });
    if (sentSince !== undefined && sentSince !== null) pathQuery.push({ name: "sentSince", value: sentSince.toString() });
    if (sentUntil !== undefined && sentUntil !== null) pathQuery.push({ name: "sentUntil", value: sentUntil.toString() });
    if (limit !== undefined && limit !== null) pathQuery.push({ name: "limit", value: limit.toString() });
    if (mcc !== undefined && mcc !== null) pathQuery.push({ name: "mcc", value: mcc.toString() });
    if (mnc !== undefined && mnc !== null) pathQuery.push({ name: "mnc", value: mnc.toString() });
    if (applicationId !== undefined && applicationId !== null) pathQuery.push({ name: "applicationId", value: applicationId.toString() });
    if (entityId !== undefined && entityId !== null) pathQuery.push({ name: "entityId", value: entityId.toString() });
    if (campaignReferenceId !== undefined && campaignReferenceId !== null) pathQuery.push({ name: "campaignReferenceId", value: campaignReferenceId.toString() });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        pathQuery.push({ name: key, value: value.toString() });
      }
    });

    const response = await infobip.getOutboundSmsMessageLogs({
      $,
      pathQuery: pathQuery.length > 0 ? pathQuery : undefined,
    });

    $.export(
      "$summary",
      `Data retrieved successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
