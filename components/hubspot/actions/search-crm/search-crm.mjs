import hubspot from "../../hubspot.app.mjs";
import {
  SEARCHABLE_OBJECT_TYPES, SEARCHABLE_OBJECT_PROPERTIES,
} from "../../common/constants.mjs";

export default {
  key: "hubspot-search-crm",
  name: "Search CRM",
  description: "Search companies, contacts, deals, feedback submissions, products, tickets, line-items, or quotes. [See the docs here](https://developers.hubspot.com/docs/api/crm/search)",
  version: "0.0.1",
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
    // eslint-disable-next-line pipedream/props-description
    props.additionalProperties = {
      type: "string[]",
      label: "Properties to return with the results",
      optional: true,
      options: async ({ page }) => {
        if (page !== 0) {
          return [];
        }
        const { results: properties } = await this.hubspot.getProperties(this.objectType);
        return properties.map((property) => ({
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
  },
  async run({ $ }) {
    const {
      objectType,
      additionalProperties,
      searchProperty,
      searchValue,
    } = this;
    const data = {
      object: objectType,
      properties: additionalProperties,
      filters: [
        {
          propertyName: searchProperty,
          operator: "EQ",
          value: searchValue,
        },
      ],
    };
    const { results } = await this.hubspot.searchCRM(data, $);
    $.export("$summary", `Successfully retrieved ${results?.length} object(s).`);
    return results;
  },
};
