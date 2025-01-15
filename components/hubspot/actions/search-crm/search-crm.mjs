import hubspot from "../../hubspot.app.mjs";
import {
  SEARCHABLE_OBJECT_TYPES,
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_LINE_ITEM_PROPERTIES,
  DEFAULT_LEAD_PROPERTIES,
} from "../../common/constants.mjs";
import common from "../common/common-create.mjs";

export default {
  key: "hubspot-search-crm",
  name: "Search CRM",
  description: "Search companies, contacts, deals, feedback submissions, products, tickets, line-items, quotes, leads, or custom objects. [See the documentation](https://developers.hubspot.com/docs/api/crm/search)",
  version: "0.0.11",
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description: "Type of CRM object to search for",
      options: [
        ...SEARCHABLE_OBJECT_TYPES,
        {
          label: "Custom Object",
          value: "custom_object",
        },
      ],
      reloadProps: true,
    },
    createIfNotFound: {
      type: "boolean",
      label: "Create if not found?",
      description: "Set to `true` to create the Hubspot object if it doesn't exist",
      default: false,
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};

    if (this.objectType === "custom_object") {
      try {
        props.customObjectType = {
          type: "string",
          label: "Custom Object Type",
          options: await this.getCustomObjectTypes(),
          reloadProps: true,
        };
      } catch {
        props.customObjectType = {
          type: "string",
          label: "Custom Object Type",
          reloadProps: true,
        };
      }
    }
    if (!this.objectType || (this.objectType === "custom_object" && !this.customObjectType)) {
      return props;
    }

    let schema;
    const objectType = this.customObjectType ?? this.objectType;
    try {
      schema = await this.hubspot.getSchema({
        objectType,
      });

      props.searchProperty = {
        type: "string",
        label: "Search Property",
        description: "The field to search",
        options: schema.searchableProperties,
      };
    } catch {
      props.searchProperty = {
        type: "string",
        label: "Search Property",
        description: "The field to search",
      };
    }

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

    try {
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
            objectType: this.customObjectType ?? this.objectType,
          });
          const defaultProperties = this.getDefaultProperties();
          return properties.filter(({ name }) => !defaultProperties.includes(name))
            .map((property) => ({
              label: property.label,
              value: property.name,
            }));
        },
      };
    } catch {
      props.additionalProperties = {
        type: "string[]",
        label: "Additional properties to retrieve",
        optional: true,
      };
    }

    let creationProps = {};
    if (this.createIfNotFound && objectType) {
      try {
        const { results: properties } = await this.hubspot.getProperties({
          objectType,
        });
        const relevantProperties = properties.filter(this.isRelevantProperty);
        const propDefinitions = [];
        for (const property of relevantProperties) {
          propDefinitions.push(await this.makePropDefinition(property, schema.requiredProperties));
        }
        creationProps = propDefinitions
          .reduce((props, {
            name, ...definition
          }) => {
            props[name] = definition;
            return props;
          }, {});
      } catch {
        props.creationProps = {
          type: "object",
          label: "Object Properties",
          description: "A JSON object containing the object to create if not found",
        };
      }
    }
    return {
      ...props,
      ...creationProps,
    };
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return this.objectType;
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
      } else if (this.objectType === "lead") {
        return DEFAULT_LEAD_PROPERTIES;
      } else {
        return [];
      }
    },
    async getCustomObjectTypes() {
      const { results } = await this.hubspot.listSchemas();
      return results?.map(({ name }) => name ) || [];
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      objectType,
      customObjectType,
      additionalProperties = [],
      searchProperty,
      searchValue,
      /* eslint-disable no-unused-vars */
      info,
      createIfNotFound,
      creationProps,
      ...otherProperties
    } = this;

    const properties = creationProps
      ? typeof creationProps === "string"
        ? JSON.parse(creationProps)
        : creationProps
      : otherProperties;

    const defaultProperties = this.getDefaultProperties();
    const data = {
      properties: [
        ...defaultProperties,
        ...additionalProperties,
      ],
      filters: [
        {
          propertyName: searchProperty,
          operator: "EQ",
          value: searchValue,
        },
      ],
    };
    const { results } = await hubspot.searchCRM({
      object: customObjectType ?? objectType,
      data,
      $,
    });

    if (!results?.length && createIfNotFound) {
      const response = await hubspot.createObject({
        $,
        objectType: customObjectType ?? objectType,
        data: {
          properties,
        },
      });
      const objectName = hubspot.getObjectTypeName(customObjectType ?? objectType);
      $.export("$summary", `Successfully created ${objectName}`);
      return response;
    }

    $.export("$summary", `Successfully retrieved ${results?.length} object(s).`);
    return results;
  },
};
