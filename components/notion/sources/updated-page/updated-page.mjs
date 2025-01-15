import notion from "../../notion.app.mjs";
import sampleEmit from "./test-event.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";
import zlib from "zlib";

export default {
  ...base,
  key: "notion-updated-page",
  name: "Updated Page in Database", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when a page in a database is updated. To select a specific page, use `Updated Page ID` instead",
  version: "0.1.4",
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
    includeNewPages: {
      type: "boolean",
      label: "Include New Pages",
      description: "Set to `true` to emit events when pages are created. Set to `false` to ignore new pages.",
      default: true,
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
    alert: {
      type: "alert",
      alertType: "info",
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
      const pagesStream = this.notion.getPages(this.databaseId, params);
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
      const { properties } = await this.notion.retrieveDatabase(this.databaseId);
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
    const pagesStream = this.notion.getPages(this.databaseId, params);

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

      for (const propertyName of propertiesToCheck) {
        const previousValue = structuredClone(propertyValues[page.id]?.[propertyName]);
        // value used to compare and to save to this.db
        const currentValueToSave = this._maybeRemoveFileSubItems(page.properties[propertyName]);
        // (unmodified) value that should be emitted
        const currentValueToEmit = page.properties[propertyName];

        const pageExistsInDB = propertyValues[page.id] != null;
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
          isNewPage = true;
          propertyHasChanged = true;
          propertyValues[page.id] = {
            [propertyName]: currentValueToSave,
          };
          changes.push({
            property: propertyName,
            previousValue,
            currentValue: currentValueToEmit,
          });
        }
      }

      if (isNewPage && !this.includeNewPages) {
        console.log(`Ignoring new page: ${page.id}`);
        continue;
      }

      if (propertyHasChanged) {
        this._emitEvent(page, changes, isNewPage);
      }
    }

    this._setLastUpdatedTimestamp(newLastUpdatedTimestamp);
    this._setPropertyValues(propertyValues);
  },
  sampleEmit,
};
