import notion from "../../notion.app.mjs";
import sampleEmit from "./test-event.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";
import md5 from "md5";

export default {
  ...base,
  key: "notion-updated-page",
  name: "Updated Page in Database", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when a page in a database is updated. To select a specific page, use `Updated Page ID` instead",
  version: "0.0.18",
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
      const params = this.lastUpdatedSortParam();
      const pagesStream = this.notion.getPages(this.databaseId, params);
      let count = 0;
      let lastUpdatedTimestamp = 0;
      for await (const page of pagesStream) {
        propertyValues[page.id] = {};
        for (const propertyName of properties) {
          const hash = this.calculateHash(page.properties[propertyName]);
          propertyValues[page.id][propertyName] = hash;
        }
        lastUpdatedTimestamp = Math.max(
          lastUpdatedTimestamp,
          Date.parse(page?.last_edited_time),
        );
        if (count < 25) {
          this.emitEvent(page);
        }
        count++;
      }
      this._setPropertyValues(propertyValues);
      this.setLastUpdatedTimestamp(lastUpdatedTimestamp);
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
    calculateHash(property) {
      const clone = structuredClone(property);
      this.maybeRemoveFileSubItems(clone);
      return md5(JSON.stringify(clone));
    },
    maybeRemoveFileSubItems(property) {
      // Files & Media type:
      // `url` and `expiry_time` are constantly updated by Notion, so ignore these fields
      if (property.type === "files") {
        for (const file of property.files) {
          if (file.type === "file") {
            delete file.file;
          }
        }
      }
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
    emitEvent(page) {
      const meta = this.generateMeta(page, constants.summaries.PAGE_UPDATED);
      this.$emit(page, meta);
    },
  },
  async run() {
    const lastCheckedTimestamp = this.getLastUpdatedTimestamp();
    const propertyValues = this._getPropertyValues();

    const params = {
      ...this.lastUpdatedSortParam(),
      filter: {
        timestamp: "last_edited_time",
        last_edited_time: {
          on_or_after: new Date(lastCheckedTimestamp).toISOString(),
        },
      },
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
      for (const propertyName of properties) {
        const hash = this.calculateHash(page.properties[propertyName]);
        const dbValue = propertyValues[page.id][propertyName];
        if (!propertyValues[page.id] || hash !== dbValue) {
          propertyChangeFound = true;
          propertyValues[page.id] = {
            ...propertyValues[page.id],
            [propertyName]: hash,
          };
        }
      }
      if (!propertyChangeFound && Date.parse(page?.last_edited_time) <= lastCheckedTimestamp) {
        continue;
      }

      if (!this.includeNewPages && page?.last_edited_time === page?.created_time) {
        continue;
      }

      this.emitEvent(page);

      if (Date.parse(page?.last_edited_time) < lastCheckedTimestamp) {
        break;
      }
    }

    this.setLastUpdatedTimestamp(newLastUpdatedTimestamp);
    this._setPropertyValues(propertyValues);
  },
  sampleEmit,
};
