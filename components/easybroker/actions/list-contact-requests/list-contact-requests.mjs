import easybroker from "../../easybroker.app.mjs";

export default {
  key: "easybroker-list-contact-requests",
  name: "List Contact Requests",
  description: "List all contact requests. [See the documentation](https://dev.easybroker.com/reference/get_contact-requests)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    easybroker,
    propertyId: {
      propDefinition: [
        easybroker,
        "propertyId",
      ],
      description: "The ID of a property to retrieve the contact requests for",
      optional: true,
    },
    happenedAfter: {
      type: "string",
      label: "Happened After",
      description: "Get contact requests created after the given date. Example: `2025-03-01T23:26:53.402Z`",
      optional: true,
    },
    happenedBefore: {
      type: "string",
      label: "Happened Before",
      description: "Get contact requests created before the given date. Example: `2025-03-01T23:26:53.402Z`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of contact requests to return",
      optional: true,
      max: 50,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return",
      optional: true,
      default: 1,
    },
  },
  async run({ $ }) {
    const response = await this.easybroker.listContactRequests({
      $,
      params: {
        property_id: this.propertyId,
        happened_after: this.happenedAfter,
        happened_before: this.happenedBefore,
        limit: this.limit,
        page: this.page,
      },
    });
    $.export("$summary", `Successfully listed ${response?.content?.length} contact request${response?.content?.length === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
