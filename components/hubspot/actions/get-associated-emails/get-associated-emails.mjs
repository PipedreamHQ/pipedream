import {
  DEFAULT_EMAIL_PROPERTIES, OBJECT_TYPE, OBJECT_TYPES,
} from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-associated-emails",
  name: "Get Associated Emails",
  description: "Retrieves emails associated with a specific object (contact, company, or deal). [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/search)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Associated Object Type",
      description: "The type of the object the emails are associated with",
      options: OBJECT_TYPES.filter(({ value }) => [
        OBJECT_TYPE.CONTACT,
        OBJECT_TYPE.COMPANY,
        OBJECT_TYPE.DEAL,
      ].includes(value)),
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
      default: 100,
      min: 1,
      max: 200,
    },
  },
  methods: {
    async getAssociatedEmails({
      objectType,
      objectId,
      additionalProperties = [],
      limit = 100,
    }) {
      const properties = [
        ...DEFAULT_EMAIL_PROPERTIES,
        ...additionalProperties,
      ];

      const { results } = await this.hubspot.searchCRM({
        object: "emails",
        data: {
          filterGroups: [
            {
              filters: [
                {
                  propertyName: `associations.${objectType}`,
                  operator: "EQ",
                  value: objectId,
                },
              ],
            },
          ],
          properties,
          associations: [
            objectType,
          ],
          sorts: [
            {
              propertyName: "hs_timestamp",
              direction: "DESCENDING",
            },
          ],
          limit,
        },
      });

      return results;
    },
  },
  async run({ $ }) {
    const emails = await this.getAssociatedEmails({
      objectType: this.objectType,
      objectId: this.objectId,
      additionalProperties: this.additionalProperties,
      limit: this.limit,
    });

    const summary = `Successfully retrieved ${emails?.length || 0} email(s)`;

    $.export("$summary", summary);

    return emails || [];
  },
};
