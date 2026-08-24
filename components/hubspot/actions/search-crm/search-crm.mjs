// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import {
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_LEAD_PROPERTIES,
  DEFAULT_LINE_ITEM_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  SEARCHABLE_OBJECT_TYPES,
} from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";
import { parseObjectProperties } from "../../common/utils.mjs";
const DEFAULT_LIMIT = 200;

export default {
  key: "hubspot-search-crm",
  name: "Search CRM",
  description:
    "Search a CRM object type by a single property. Set **Object Type**, **Search Property** (internal name, e.g. `email` or `dealname`; use **Get Properties** / **Search Properties** to find valid names), and **Search Value**. With **Exact Match** off, partial (substring) matches are returned. Results are capped per call — if `paging.next` is present in the response, call again with **Offset** advanced to fetch the next page. Example: Object Type `deal`, Search Property `dealname`, Search Value `InGen Annual Contract`. Returns matching records plus paging. [See the documentation](https://developers.hubspot.com/docs/api/crm/search)",
  version: "2.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description:
        "Type of CRM object to search. For a custom object, set this to `custom_object` and provide **Custom Object Type**.",
      options: [
        ...SEARCHABLE_OBJECT_TYPES,
        {
          label: "Custom Object",
          value: "custom_object",
        },
      ],
    },
    customObjectType: {
      type: "string",
      label: "Custom Object Type",
      description:
        "Required only when **Object Type** is `custom_object`: the object's `fullyQualifiedName` (e.g. `p_my_object`) or `objectTypeId`.",
      optional: true,
    },
    searchProperty: {
      type: "string",
      label: "Search Property",
      description:
        "Internal name of the property to search on (e.g. `email`, `dealname`, `firstname`). "
        + "Use **Search Properties** or **Get Properties** to discover valid names for the object type.",
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description:
        "The value to match. With **Exact Match** on, returns records where **Search Property** equals this exactly; "
        + "with it off, returns partial (case-insensitive substring) matches.",
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description:
        "Set to `true` to search for an exact match of the search value. If `false`, partial matches will be returned. Default: `true`",
      default: true,
      optional: true,
    },
    additionalProperties: {
      type: "string[]",
      label: "Additional properties to retrieve",
      description:
        "Internal property names to return in addition to the default set for the object type "
        + "(e.g. `[\"amount\", \"dealstage\"]`). Use **Get Properties** to discover valid names.",
      optional: true,
    },
    createIfNotFound: {
      type: "boolean",
      label: "Create if not found?",
      description:
        "Set to `true` to create the object (from **Create Properties**) when the search returns no match.",
      default: false,
      optional: true,
    },
    creationProps: {
      type: "object",
      label: "Create Properties",
      description:
        "Properties for the object to create when **Create if not found?** is `true` and nothing matched, "
        + "as a JSON object of internal property name → value (e.g. `{ \"email\": \"a@b.com\", \"firstname\": \"Ada\" }`).",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The offset to start from. Used for pagination.",
      default: 0,
      optional: true,
    },
  },
  methods: {
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
  },
  async run({ $ }) {
    const {
      hubspot,
      objectType,
      customObjectType,
      additionalProperties = [],
      searchProperty,
      searchValue,
      exactMatch,
      offset,
      createIfNotFound,
      creationProps,
    } = this;

    if (objectType === "custom_object" && !customObjectType?.trim()) {
      throw new ConfigurationError(
        "**Custom Object Type** is required when **Object Type** is `custom_object`.",
      );
    }
    const actualObjectType = objectType === "custom_object"
      ? customObjectType
      : objectType;

    const schema = await this.hubspot.getSchema({
      objectType: actualObjectType,
    });

    if (!schema.searchableProperties.includes(searchProperty)) {
      throw new ConfigurationError(
        `Property \`${searchProperty}\` is not a searchable property of object type \`${objectType}\`. ` +
          `\n\nAvailable searchable properties are: \`${schema.searchableProperties.join("`, `")}\``,
      );
    }

    const defaultProperties = this.getDefaultProperties();
    const data = {
      properties: [
        ...defaultProperties,
        ...additionalProperties,
        searchProperty,
      ],
      sorts: [
        {
          propertyName: "createdate",
          direction: "DESCENDING",
        },
      ],
      limit: DEFAULT_LIMIT,
      after: offset,
    };

    if (exactMatch) {
      data.filters = [
        {
          propertyName: searchProperty,
          operator: "EQ",
          value: searchValue,
        },
      ];
    }

    let {
      results, paging,
    } = await this.hubspot.searchCRM({
      object: actualObjectType,
      data,
    });

    if (!exactMatch) {
      results = results?.filter(
        (result) =>
          result.properties[searchProperty] &&
          result.properties[searchProperty]
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
      );
    }

    if (!results?.length && createIfNotFound) {
      const properties = parseObjectProperties(creationProps ?? {}, "Create Properties");
      if (!Object.keys(properties).length) {
        throw new ConfigurationError(
          "**Create Properties** is required when **Create if not found?** is enabled and no match was found.",
        );
      }
      const response = await hubspot.createObject({
        $,
        objectType: actualObjectType,
        data: {
          properties,
        },
      });
      const objectName = hubspot.getObjectTypeName(actualObjectType);
      $.export("$summary", `Successfully created ${objectName}`);
      return response;
    }

    $.export(
      "$summary",
      `Successfully retrieved ${results?.length} object(s).`,
    );
    return {
      results,
      paging,
    };
  },
};
