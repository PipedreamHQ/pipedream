import pick from "lodash-es/pick.js";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-update-page",
  name: "Update Page",
  description: "Update a page's property values. To append page content, use the *Append Block* action instead. [See the documentation](https://developers.notion.com/reference/patch-page)",
  version: "2.0.0",
  type: "action",
  props: {
    notion,
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "Properties that are not set will remain unchanged.",
    },
    parentDataSource: {
      propDefinition: [
        notion,
        "dataSourceId",
      ],
      label: "Parent Data Source ID",
      description: "Select the data source that contains the page to update. If you instead provide a data source ID in a custom expression, you will also have to provide the page's ID in a custom expression",
      reloadProps: true,
    },
    pageId: {
      propDefinition: [
        notion,
        "pageIdInDataSource",
        (c) => ({
          dataSourceId: c.parentDataSource,
        }),
      ],
    },
    archived: {
      propDefinition: [
        notion,
        "archived",
      ],
    },
    metaTypes: {
      propDefinition: [
        notion,
        "metaTypes",
      ],
    },
    propertyTypes: {
      propDefinition: [
        notion,
        "propertyTypes",
        (c) => ({
          parentId: c.parentDataSource,
          parentType: "data_source",
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    try {
      const { properties } = await this.notion.retrieveDataSource(this.parentDataSource);
      const selectedProperties = pick(properties, this.propertyTypes);

      return this.buildAdditionalProps({
        properties: selectedProperties,
        meta: this.metaTypes,
      });
    } catch {
      return {
        properties: {
          type: "object",
          label: "Properties",
          description: "The property values to update for the page. The keys are the names or IDs of the property and the values are property values. If a page property ID is not included, then it is not changed. Example: `{ \"Name\": \"Tuscan Kale\", \"Description\": \"A dark green leafy vegetable\" }`",
        },
      };
    }
  },
  methods: {
    ...base.methods,
    /**
     * Builds a page for a update operation
     * @param page - the parent page
     * @returns the constructed page in Notion format
     */
    buildPage(page) {
      const meta = this.buildDataSourceMeta(page);
      const properties = this.buildPageProperties(page.properties);
      return {
        ...meta,
        properties,
      };
    },
    parseProperties(properties) {
      if (!properties) {
        return undefined;
      }
      if (typeof properties === "string") {
        try {
          return JSON.parse(properties);
        } catch {
          throw new Error("Could not parse properties as JSON object");
        }
      }
      const parsedProperties = {};
      for (const [
        key,
        value,
      ] of Object.entries(properties)) {
        try {
          parsedProperties[key] = typeof value === "string"
            ? JSON.parse(value)
            : value;
        } catch {
          parsedProperties[key] = value;
        }
      }
      return parsedProperties;
    },
  },
  async run({ $ }) {
    try {
      this.properties = this.parseProperties(this.properties);

      const currentPage = await this.notion.retrievePage(this.pageId);
      const page = this.buildPage(currentPage);
      const response = await this.notion.updatePage(this.pageId, page);
      $.export("$summary", "Updated page successfully");
      return response;
    } catch (error) {
      throw new Error(error.body || error);
    }
  },
};
