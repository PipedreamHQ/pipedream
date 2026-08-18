import infobip from "../../infobip.app.mjs";

export default {
  key: "get-inbound-sms-messages",
  name: "Get Inbound SMS Messages",
  description:
    "Get inbound SMS messages If you are unable to receive incoming SMS to the endpoint of your choice in real-time, you can use this API call to fetch messages. Each request will return a batch of rece... [See the documentation](https://www.infobip.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to be returned in a response. If not set, the latest 50 records are returned. Maximum limit value is `1000` and you can only access messages for the last 48h.",
      optional: true,
    },
    applicationId: {
      type: "string",
      label: "Application Id",
      description: "Application id that the message is linked to. For more details, see our [documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      optional: true,
    },
    entityId: {
      type: "string",
      label: "Entity Id",
      description: "Entity id that the message is linked to. For more details, see our [documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
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
    const { infobip, limit, applicationId, entityId, campaignReferenceId, ...params } = this;

    const pathQuery = [];
    if (limit !== undefined && limit !== null) pathQuery.push({ name: "limit", value: limit.toString() });
    if (applicationId !== undefined && applicationId !== null) pathQuery.push({ name: "applicationId", value: applicationId.toString() });
    if (entityId !== undefined && entityId !== null) pathQuery.push({ name: "entityId", value: entityId.toString() });
    if (campaignReferenceId !== undefined && campaignReferenceId !== null) pathQuery.push({ name: "campaignReferenceId", value: campaignReferenceId.toString() });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        pathQuery.push({ name: key, value: value.toString() });
      }
    });

    const response = await infobip.getInboundSmsMessages({
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
