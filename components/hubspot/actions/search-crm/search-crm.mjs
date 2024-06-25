import hubspot from "../../hubspot.app.mjs";
import {
  SEARCHABLE_OBJECT_TYPES,
  SEARCHABLE_OBJECT_PROPERTIES,
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_LINE_ITEM_PROPERTIES,
} from "../../common/constants.mjs";

export default {
  key: "hubspot-search-crm",
  name: "Search CRM",
  description: "Search companies, contacts, deals, feedback submissions, products, tickets, line-items, or quotes. [See the documentation](https://developers.hubspot.com/docs/api/crm/search)",
  version: "0.0.7",
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description: "Type of CRM object to search for",
      options: SEARCHABLE_OBJECT_TYPES,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    props.searchProperty = {
      type: "string",
      label: "Search Property",
      description: "The field to search",
      options: this.getSearchProperties(),
    };
    props.searchValue = {
      type: "string",
      label: "Search Value",
      description: "Search for objects where the specified search field/property matches the search value",
    };
    const defaultProperties = this.getDefaultProperties();
    if (defaultProperties?.length) {
      props.info = {
        type: "alert",
        alertType: "info",
        content: `Properties:\n\`${defaultProperties.join(", ")}\``,
      };
    }
    // eslint-disable-next-line pipedream/props-description
    props.additionalProperties = {
      type: "string[]",
      label: "Additional properties to retrieve",
      optional: true,
      options: async ({ page }) => {
        if (page !== 0) {
          return [];
        }
        const { results: properties } = await this.hubspot.getProperties({
          objectType: this.objectType,
        });
        const defaultProperties = this.getDefaultProperties();
        return properties.filter(({ name }) => !defaultProperties.includes(name))
          .map((property) => ({
            label: property.label,
            value: property.name,
          }));
      },
    };
    return props;
  },
  methods: {
    getSearchProperties() {
      return SEARCHABLE_OBJECT_PROPERTIES[this.objectType];
    },
    getDefaultProperties() {
      if (this.objectType === "contact") {
        return DEFAULT_CONTACT_PROPERTIES;
      } else if (this.objectType === "company") {
        return DEFAULT_COMPANY_PROPERTIES;
      } else if (this.objectType === "deal") {
        return DEFAULT_DEAL_PROPERTIES;
      } else if (this.objectType === "ticket") {
        return DEFAULT_TICKET_PROPERTIES;
      } else if (this.objectType === "product") {
        return DEFAULT_PRODUCT_PROPERTIES;
      } else if (this.objectType === "line_item") {
        return DEFAULT_LINE_ITEM_PROPERTIES;
      } else {
        return [];
      }
    },
  },
  async run({ $ }) {
    const {
      objectType,
      additionalProperties = [],
      searchProperty,
      searchValue,
    } = this;
    const data = {
      properties: additionalProperties,
      filters: [
        {
          propertyName: searchProperty,
          operator: "EQ",
          value: searchValue,
        },
      ],
    };
    const { results } = await this.hubspot.searchCRM({
      object: objectType,
      data,
      $,
    });
    $.export("$summary", `Successfully retrieved ${results?.length} object(s).`);
    return results;
  },
};
