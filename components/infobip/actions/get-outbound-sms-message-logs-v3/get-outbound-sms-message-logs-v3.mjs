import infobip from "../../infobip.app.mjs";

export default {
  key: "get-outbound-sms-message-logs-v3",
  name: "Get Outbound SMS Message Logs V3",
  description:
    "Get outbound SMS message logs Use this method to obtain the logs associated with outbound messages. The available logs are limited to those generated in the last 48 hours, and you can retrieve a ma... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    mcc: {
      type: "string",
      label: "Mcc",
      description: "Mobile Country Code.",
      optional: true,
    },
    mnc: {
      type: "string",
      label: "Mnc",
      description: "Mobile Network Code. Mobile Country Code is required if this property is used.",
      optional: true,
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "The sender ID which can be alphanumeric or numeric.",
      optional: true,
    },
    destination: {
      type: "string",
      label: "Destination",
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
      description: "generalStatus parameter",
      optional: true,
    },
    sentSince: {
      type: "string",
      label: "Sent Since",
      description: "The logs will only include messages sent after this date. Use it alongside sentUntil to specify a time range for the logs, but only up to the maximum limit of 1000 logs per call. Has the following format: yyyy-MM-dd'T'HH:mm:ss.SSSZ.",
      optional: true,
    },
    sentUntil: {
      type: "string",
      label: "Sent Until",
      description: "The logs will only include messages sent before this date. Use it alongside sentSince to specify a time range for the logs, but only up to the maximum limit of 1000 logs per call. Has the following format: yyyy-MM-dd'T'HH:mm:ss.SSSZ.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to include in logs. If not set, the latest 50 records are returned. Maximum limit value is 1000 and you can only access logs for the last 48h.",
      optional: true,
    },
    entityId: {
      type: "string",
      label: "Entity Id",
      description: "Entity id used to send the message. For more details, see our [documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      optional: true,
    },
    applicationId: {
      type: "string",
      label: "Application Id",
      description: "Application id used to send the message. For more details, see our [documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      optional: true,
    },
    campaignReferenceId: {
      type: "string",
      label: "Campaign Reference Id",
      description: "ID of a campaign that was sent in the message. May contain multiple comma-separated values.",
      optional: true,
    },
    useCursor: {
      type: "boolean",
      label: "Use Cursor",
      description: "Flag used to enable cursor-based pagination. When set to true, the system will use the cursor to fetch the next set of logs.",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Value which represents the current position in the data set. For the first request, this field shouldn't be defined. In subsequent requests, use the `nextCursor` value returned from the previous response to continue fetching data.",
      optional: true,
    }
  },
  async run({ $ }) {
    const { infobip, mcc, mnc, sender, destination, bulkId, messageId, generalStatus, sentSince, sentUntil, limit, entityId, applicationId, campaignReferenceId, useCursor, cursor, ...params } = this;

    const pathQuery = [];
    if (mcc !== undefined && mcc !== null) pathQuery.push({ name: "mcc", value: mcc.toString() });
    if (mnc !== undefined && mnc !== null) pathQuery.push({ name: "mnc", value: mnc.toString() });
    if (sender !== undefined && sender !== null) pathQuery.push({ name: "sender", value: sender.toString() });
    if (destination !== undefined && destination !== null) pathQuery.push({ name: "destination", value: destination.toString() });
    if (bulkId !== undefined && bulkId !== null) pathQuery.push({ name: "bulkId", value: bulkId.toString() });
    if (messageId !== undefined && messageId !== null) pathQuery.push({ name: "messageId", value: messageId.toString() });
    if (generalStatus !== undefined && generalStatus !== null) pathQuery.push({ name: "generalStatus", value: generalStatus.toString() });
    if (sentSince !== undefined && sentSince !== null) pathQuery.push({ name: "sentSince", value: sentSince.toString() });
    if (sentUntil !== undefined && sentUntil !== null) pathQuery.push({ name: "sentUntil", value: sentUntil.toString() });
    if (limit !== undefined && limit !== null) pathQuery.push({ name: "limit", value: limit.toString() });
    if (entityId !== undefined && entityId !== null) pathQuery.push({ name: "entityId", value: entityId.toString() });
    if (applicationId !== undefined && applicationId !== null) pathQuery.push({ name: "applicationId", value: applicationId.toString() });
    if (campaignReferenceId !== undefined && campaignReferenceId !== null) pathQuery.push({ name: "campaignReferenceId", value: campaignReferenceId.toString() });
    if (useCursor !== undefined && useCursor !== null) pathQuery.push({ name: "useCursor", value: useCursor.toString() });
    if (cursor !== undefined && cursor !== null) pathQuery.push({ name: "cursor", value: cursor.toString() });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        pathQuery.push({ name: key, value: value.toString() });
      }
    });

    const response = await infobip.getOutboundSmsMessageLogsV3({
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
