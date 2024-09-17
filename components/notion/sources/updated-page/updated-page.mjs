import notion from "../../notion.app.mjs";
import sampleEmit from "./test-event.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "notion-updated-page",
  name: "Updated Page in Database", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when a page in a database is updated. To select a specific page, use `Updated Page ID` instead",
  version: "0.0.16",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
    },
    properties: {
      propDefinition: [
        notion,
        "propertyTypes",
        (c) => ({
          parentId: c.databaseId,
          parentType: "database",
        }),
      ],
      description: "Only emit events when one or more of the selected properties have changed",
      optional: true,
    },
    includeNewPages: {
      type: "boolean",
      label: "Include New Pages",
      description: "Emit events when pages are created or updated. Set to `true` to include newly created pages. Set to `false` to only emit updated pages. Defaults to `false`.",
      default: false,
    },
  },
  hooks: {
    async deploy() {
      const properties = await this.getProperties();
      const propertyValues = {};
      const pagesStream = this.notion.getPages(this.databaseId);
      for await (const page of pagesStream) {
        propertyValues[page.id] = {};
        for (const property of properties) {
          propertyValues[page.id][property] = JSON.stringify(page.properties[property]);
        }
      }
      this._setPropertyValues(propertyValues);
    },
  },
  methods: {
    ...base.methods,
    _getPropertyValues() {
      return this.db.get("propertyValues");
    },
    _setPropertyValues(propertyValues) {
      this.db.set("propertyValues", propertyValues);
    },
    async getProperties() {
      if (this.properties?.length) {
        return this.properties;
      }
      const { properties } = await this.notion.retrieveDatabase(this.databaseId);
      return Object.keys(properties);
    },
    generateMeta(obj, summary) {
      const { id } = obj;
      const title = this.notion.extractPageTitle(obj);
      const ts = Date.now();
      return {
        id: `${id}-${ts}`,
        summary: `${summary}: ${title} - ${id}`,
        ts,
      };
    },
  },
  async run() {
    const lastCheckedTimestamp = this.getLastUpdatedTimestamp();
    const propertyValues = this._getPropertyValues();

    const params = {
      ...this.lastUpdatedSortParam(),
    };
    let newLastUpdatedTimestamp = lastCheckedTimestamp;
    const properties = await this.getProperties();
    const pagesStream = this.notion.getPages(this.databaseId, params);

    for await (const page of pagesStream) {
      newLastUpdatedTimestamp = Math.max(
        newLastUpdatedTimestamp,
        Date.parse(page?.last_edited_time),
      );

      let propertyChangeFound = false;
      for (const property of properties) {
        const currentProperty = JSON.stringify(page.properties[property]);
        if (!propertyValues[page.id] || currentProperty !== propertyValues[page.id][property]) {
          propertyChangeFound = true;
          propertyValues[page.id] = {
            ...propertyValues[page.id],
            [property]: currentProperty,
          };
        }
      }
      if (!propertyChangeFound && Date.parse(page?.last_edited_time) <= lastCheckedTimestamp) {
        continue;
      }

      if (!this.includeNewPages && page?.last_edited_time === page?.created_time) {
        continue;
      }

      const meta = this.generateMeta(page, constants.summaries.PAGE_UPDATED);
      this.$emit(page, meta);
    }

    this.setLastUpdatedTimestamp(newLastUpdatedTimestamp);
    this._setPropertyValues(propertyValues);
  },
  sampleEmit,
};
