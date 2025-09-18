import infobip from "../../infobip.app.mjs";

export default {
  key: "get-outbound-sms-message-delivery-reports",
  name: "Get Outbound SMS Message Delivery Reports",
  description:
    "Get outbound SMS message delivery reports If you are for any reason unable to receive real-time delivery reports on your endpoint, you can use this API method to learn if and when the message has b... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    bulkId: {
      type: "string",
      label: "Bulk Id",
      description: "Unique ID assigned to the request if messaging multiple recipients or sending multiple messages via a single API request.",
      optional: true,
    },
    messageId: {
      type: "string",
      label: "Message Id",
      description: "Unique message ID for which a report is requested.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of delivery reports to be returned. If not set, the latest 50 records are returned. Maximum limit value is `1000` and you can only access reports for the last 48h.",
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
      description: "ID of a campaign that was sent in the message.",
      optional: true,
    }
  },
  async run({ $ }) {
    const { infobip, bulkId, messageId, limit, applicationId, entityId, campaignReferenceId, ...params } = this;

    const pathQuery = [];
    if (bulkId !== undefined && bulkId !== null) pathQuery.push({ name: "bulkId", value: bulkId.toString() });
    if (messageId !== undefined && messageId !== null) pathQuery.push({ name: "messageId", value: messageId.toString() });
    if (limit !== undefined && limit !== null) pathQuery.push({ name: "limit", value: limit.toString() });
    if (applicationId !== undefined && applicationId !== null) pathQuery.push({ name: "applicationId", value: applicationId.toString() });
    if (entityId !== undefined && entityId !== null) pathQuery.push({ name: "entityId", value: entityId.toString() });
    if (campaignReferenceId !== undefined && campaignReferenceId !== null) pathQuery.push({ name: "campaignReferenceId", value: campaignReferenceId.toString() });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        pathQuery.push({ name: key, value: value.toString() });
      }
    });

    const response = await infobip.getOutboundSmsMessageDeliveryReports({
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
