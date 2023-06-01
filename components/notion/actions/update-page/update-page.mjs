import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import { pick } from "lodash-es";
import { ConfigurationError } from "@pipedream/platform";

/**
 * Currently, additionalProps cannot evaluate custom expressions - {{steps.trigger.event.id}}.
 * This is a workaround to allow the user to set the property values without async options.
 * When the issue is resolved, additionalProps and the indicated commented parts can be used again.
 * See https://github.com/PipedreamHQ/pipedream/issues/3255.
 */

export default {
  ...base,
  key: "notion-update-page",
  name: "Update Page",
  description: "Updates page property values for the specified page. Properties that are not set will remain unchanged. To append page content, use the *append block* action. [See the docs](https://developers.notion.com/reference/patch-page)",
  version: "0.3.1",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      // TODO: change to `true` when additionalProps is enabled
      reloadProps: false,
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
      // TODO: remove this line when additionalProps is enabled
      reloadProps: false,
    },
    propertyTypes: {
      propDefinition: [
        notion,
        "propertyTypes",
        (c) => ({
          parentId: c.pageId,
          parentType: "page",
        }),
      ],
      // TODO: remove this line when additionalProps is enabled
      reloadProps: false,
    },
    // TODO: remove this prop when additionalProps is enabled
    propertyTypesValues: {
      type: "string[]",
      label: "Property Types Values",
      description: "The values for the selected page properties",
      optional: true,
    },
  },
  async additionalProps() {
    const { properties } = await this.notion.retrievePage(this.pageId);
    const selectedProperties = pick(properties, this.propertyTypes);

    return this.buildAdditionalProps({
      properties: selectedProperties,
      meta: this.metaTypes,
    });
  },
  methods: {
    ...base.methods,
    // TODO: remove this method when additionalProps is enabled
    parseArray(array) {
      return Array.isArray(array)
        ? array
        : JSON.parse(array || "[]");
    },
    // TODO: remove this method when additionalProps is enabled
    configurePageValues() {
      const keys = this.parseArray(this.propertyTypes);
      const values = this.parseArray(this.propertyTypesValues);

      if (keys.length !== values.length) {
        throw new ConfigurationError("The number of property keys and values must be equal");
      }

      for (let i = 0; i < keys.length || 0; i++) {
        this[keys[i]] = values[i];
      }
    },
    /**
     * Builds a page for a update operation
     * @param page - the parent page
     * @returns the constructed page in Notion format
     */
    buildPage(page) {
      const meta = this.buildDatabaseMeta(page);
      const properties = this.buildPageProperties(page.properties);
      return {
        ...meta,
        properties,
      };
    },
  },
  async run({ $ }) {
    // TODO: remove this line when additionalProps is enabled
    this.configurePageValues();
    const currentPage = await this.notion.retrievePage(this.pageId);
    const page = this.buildPage(currentPage);
    const response = await this.notion.updatePage(this.pageId, page);
    $.export("$summary", "Updated page successfully");
    return response;
  },
};
