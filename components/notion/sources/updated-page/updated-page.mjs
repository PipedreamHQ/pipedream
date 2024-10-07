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
  version: "0.1.2",
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
  },
  hooks: {
    async deploy() {
      const propertiesToCheck = await this.getPropertiesToCheck();
      const propertyValues = {};
      const params = this.lastUpdatedSortParam();
      const pagesStream = this.notion.getPages(this.databaseId, params);
      let count = 0;
      let lastUpdatedTimestamp = 0;
      for await (const page of pagesStream) {
        for (const propertyName of propertiesToCheck) {
          const currentValue = this.maybeRemoveFileSubItems(page.properties[propertyName]);
          propertyValues[page.id] = {
            ...propertyValues[page.id],
            [propertyName]: currentValue,
          };
        }
        lastUpdatedTimestamp = Math.max(
          lastUpdatedTimestamp,
          Date.parse(page.last_edited_time),
        );
        if (count++ < 25) {
          this.emitEvent(page);
        }
      }
      this._setPropertyValues(propertyValues);
      this.setLastUpdatedTimestamp(lastUpdatedTimestamp);
    },
  },
  methods: {
    ...base.methods,
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
    async getPropertiesToCheck() {
      if (this.properties?.length) {
        return this.properties;
      }
      const { properties } = await this.notion.retrieveDatabase(this.databaseId);
      return Object.keys(properties);
    },
    maybeRemoveFileSubItems(property) {
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
    generateMeta(obj, summary) {
      const { id } = obj;
      const title = this.notion.extractPageTitle(obj);
      const ts = Date.now();
      return {
        id: `${id}-${ts}`,
        summary: `${summary}: ${title}`,
        ts,
      };
    },
    emitEvent(page, changes = [], isNewPage = true) {
      const meta = isNewPage
        ? this.generateMeta(page, constants.summaries.PAGE_ADDED)
        : this.generateMeta(page, constants.summaries.PAGE_UPDATED);
      const event = {
        page,
        changes,
      };
      this.$emit(event, meta);
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
    const propertiesToCheck = await this.getPropertiesToCheck();
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
        const currentValueToSave = this.maybeRemoveFileSubItems(page.properties[propertyName]);
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
        this.emitEvent(page, changes, isNewPage);
      }
    }

    this.setLastUpdatedTimestamp(newLastUpdatedTimestamp);
    this._setPropertyValues(propertyValues);
  },
  sampleEmit,
};
