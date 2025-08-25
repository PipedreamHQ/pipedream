import { DEFAULT_EMAIL_PROPERTIES } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-associated-emails",
  name: "Get Associated Emails",
  description: "Retrieves emails associated with a specific object (contact, company, or deal). [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/search)",
  version: "0.0.2",
  type: "action",
  props: {
    hubspot,
    objectType: {
      propDefinition: [
        hubspot,
        "objectType",
        () => ({
          includeCustom: true,
        }),
      ],
      label: "Associated Object Type",
      description: "The type of the object the emails are associated with",
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description: "The ID of the object to get associated emails for",
      propDefinition: [
        hubspot,
        "objectIds",
        ({ objectType }) => ({
          objectType,
        }),
      ],
    },
    additionalProperties: {
      type: "string[]",
      label: "Additional Properties",
      description: "Additional properties to retrieve for the emails",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of emails to retrieve",
      optional: true,
      default: 20,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const properties = [
      ...DEFAULT_EMAIL_PROPERTIES,
      ...(this.additionalProperties || []),
    ];

    const {
      objectType, objectId, limit,
    } = this;

    const { results } = await this.hubspot.getAssociations({
      $,
      objectType,
      objectId,
      toObjectType: "emails",
      params: {
        limit,
      },
    });

    if (!results?.length > 0) {
      $.export("$summary", "No emails found with this association");
      return [];
    }

    const emailIds = results.map((association) => ({
      id: association.toObjectId,
    }));

    const { results: emails } = await this.hubspot.batchGetObjects({
      $,
      objectType: "emails",
      data: {
        properties,
        inputs: emailIds,
      },
    });

    // Sort emails by timestamp in descending order (most recent first)
    emails?.sort((a, b) => {
      const timestampA = new Date(a.properties?.hs_timestamp || 0).getTime();
      const timestampB = new Date(b.properties?.hs_timestamp || 0).getTime();
      return timestampB - timestampA;
    }) || [];

    const summary = `Successfully retrieved ${emails.length} email(s)`;

    $.export("$summary", summary);

    return emails;
  },
};
