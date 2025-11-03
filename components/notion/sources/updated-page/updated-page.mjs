import zlib from "zlib";
import notion from "../../notion.app.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "notion-updated-page",
  name: "New or Updated Page in Data Source (By Property)",
  description: "Emit new event when a page is created or updated in the selected data source. [See the documentation](https://developers.notion.com/reference/page)",
  version: "1.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    dataSourceId: {
      propDefinition: [
        notion,
        "dataSourceId",
      ],
    },
    includeNewPages: {
      type: "boolean",
      label: "Include New Pages",
      description: "Set to `false` to emit events only for updates, not for new pages.",
      default: true,
    },
    properties: {
      propDefinition: [
        notion,
        "propertyTypes",
        (c) => ({
          parentId: c.dataSourceId,
          parentType: "data_source",
        }),
      ],
      description: "Only emit events when one or more of the selected properties have changed",
      optional: true,
    },
    alert: {
      type: "alert",
      alertType: "warning",
      content: "Source not saving? Your database might be too large. If deployment takes longer than one minute, an error will occur.",
    },
  },
  hooks: {
    async activate() {
      console.log("Activating: fetching pages and properties");
      this._setLastUpdatedTimestamp(Date.now());
      const propertyValues = {};
      const propertiesToCheck = await this._getPropertiesToCheck();
      const params = this.lastUpdatedSortParam();
      const pagesStream = this.notion.getPages(this.dataSourceId, params);
      for await (const page of pagesStream) {
        for (const propertyName of propertiesToCheck) {
          const currentValue = this._maybeRemoveFileSubItems(page.properties[propertyName]);
          propertyValues[page.id] = {
            ...propertyValues[page.id],
            [propertyName]: currentValue,
          };
        }
      }
      this._setPropertyValues(propertyValues);
    },
    async deactivate() {
      console.log("Deactivating: clearing states");
      this._setLastUpdatedTimestamp(null);
    },
  },
  methods: {
    ...base.methods,
    _getLastUpdatedTimestamp() {
      return this.db.get(constants.timestamps.LAST_EDITED_TIME);
    },
    _setLastUpdatedTimestamp(ts) {
      this.db.set(constants.timestamps.LAST_EDITED_TIME, ts);
    },
    _getPropertyValues() {
      const compressed = this.db.get("propertyValues");
      const buffer = Buffer.from(compressed, "base64");
      const decompressed = zlib.inflateSync(buffer).toString();
      return JSON.parse(decompressed);
    },
    _setPropertyValues(propertyValues) {
      const string = JSON.stringify(propertyValues);
      const compressed = zlib.deflateSync(string).toString("base64");
      this.db.set("propertyValues", compressed);
    },
    async _getPropertiesToCheck() {
      if (this.properties?.length) {
        return this.properties;
      }
      const { properties } = await this.notion.retrieveDataSource(this.dataSourceId);
      return Object.keys(properties);
    },
    _maybeRemoveFileSubItems(property) {
      // Files & Media type:
      // `url` and `expiry_time` are constantly updated by Notion, so ignore these fields
      if (property.type === "files") {
        const modified = structuredClone(property);
        for (const file of modified.files) {
          if (file.type === "file") {
            delete file.file;
          }
        }
        return modified;
      }
      return property;
    },
    _generateMeta(obj, summary) {
      const { id } = obj;
      const title = this.notion.extractPageTitle(obj);
      const ts = Date.now();
      return {
        id: `${id}-${ts}`,
        summary: `${summary}: ${title}`,
        ts,
      };
    },
    _emitEvent(page, changes = [], isNewPage = true) {
      const meta = isNewPage
        ? this._generateMeta(page, constants.summaries.PAGE_ADDED)
        : this._generateMeta(page, constants.summaries.PAGE_UPDATED);
      const event = {
        page,
        changes,
      };
      this.$emit(event, meta);
    },
  },
  async run() {
    const lastCheckedTimestamp = this._getLastUpdatedTimestamp();
    const propertyValues = this._getPropertyValues();

    if (!lastCheckedTimestamp) {
      // recently updated (deactivated / activated), skip execution
      console.log("Awaiting restart completion: skipping execution");
      return;
    }

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
    const propertiesToCheck = await this._getPropertiesToCheck();
    const pagesStream = this.notion.getPages(this.dataSourceId, params);

    for await (const page of pagesStream) {
      const changes = [];
      let isNewPage = false;
      let propertyHasChanged = false;

      newLastUpdatedTimestamp = Math.max(
        newLastUpdatedTimestamp,
        Date.parse(page.last_edited_time),
      );

      if (lastCheckedTimestamp > Date.parse(page.last_edited_time)) {
        break;
      }

      // Check if this is a new page first
      const pageExistsInDB = propertyValues[page.id] != null;
      isNewPage = !pageExistsInDB;

      for (const propertyName of propertiesToCheck) {
        const previousValue = structuredClone(propertyValues[page.id]?.[propertyName]);
        // value used to compare and to save to this.db
        const currentValueToSave = this._maybeRemoveFileSubItems(page.properties[propertyName]);
        // (unmodified) value that should be emitted
        const currentValueToEmit = page.properties[propertyName];

        const propertyChanged =
          JSON.stringify(previousValue) !== JSON.stringify(currentValueToSave);

        if (pageExistsInDB && propertyChanged) {
          propertyHasChanged = true;
          propertyValues[page.id] = {
            ...propertyValues[page.id],
            [propertyName]: currentValueToSave,
          };
          changes.push({
            property: propertyName,
            previousValue,
            currentValue: currentValueToEmit,
          });
        }

        if (!pageExistsInDB) {
          // For new pages, always track the properties
          if (!propertyValues[page.id]) {
            propertyValues[page.id] = {};
          }
          propertyValues[page.id][propertyName] = currentValueToSave;

          // Only mark as changed (to emit event) if includeNewPages is true
          if (this.includeNewPages) {
            propertyHasChanged = true;
            changes.push({
              property: propertyName,
              previousValue,
              currentValue: currentValueToEmit,
            });
          }
        }
      }

      // Only emit events if:
      // 1. It's an existing page with changes, OR
      // 2. It's a new page and includeNewPages is true
      if (propertyHasChanged && (!isNewPage || this.includeNewPages)) {
        this._emitEvent(page, changes, isNewPage);
      }
    }

    this._setLastUpdatedTimestamp(newLastUpdatedTimestamp);
    this._setPropertyValues(propertyValues);
  },
  sampleEmit,
};
