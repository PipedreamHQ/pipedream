import notion from "../../notion.app.mjs";
import sampleEmit from "./test-event.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "notion-updated-page",
  name: "Updated Page in Database", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when a page in a database is updated. To select a specific page, use `Updated Page ID` instead",
  version: "0.0.12",
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
      description: "Only emit events when one or more of the selected properties has changed",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      if (!this.properties?.length) {
        return;
      }
      const propertyValues = {};
      const pagesStream = this.notion.getPages(this.databaseId);
      for await (const page of pagesStream) {
        propertyValues[page.id] = {};
        for (const property of this.properties) {
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
  },
  async run() {
    const lastCheckedTimestamp = this.getLastUpdatedTimestamp();
    const lastCheckedTimestampDate = new Date(lastCheckedTimestamp);
    const lastCheckedTimestampISO = lastCheckedTimestampDate.toISOString();
    const propertyValues = this._getPropertyValues();

    // Add a filter so that we only receive pages that have been updated since the last call.
    const params = {
      ...this.lastUpdatedSortParam(),
      filter: {
        timestamp: "last_edited_time",
        last_edited_time: {
          after: lastCheckedTimestampISO,
        },
      },
    };
    let newLastUpdatedTimestamp = lastCheckedTimestamp;

    const pagesStream = this.notion.getPages(this.databaseId, params);

    for await (const page of pagesStream) {
      if (!this.isResultNew(page.last_edited_time, lastCheckedTimestamp)) {
        // The call to getPages() includes a descending sort by last_edited_time.
        // As soon as one page !isResultNew(), all of the following ones will also.
        // NOTE: the last_edited_filter means this will never be called,
        // but it's worth keeping as future-proofing.
        break;
      }

      newLastUpdatedTimestamp = Math.max(
        newLastUpdatedTimestamp,
        Date.parse(page?.last_edited_time),
      );

      if (this.properties?.length) {
        let propertyChangeFound = false;
        for (const property of this.properties) {
          const currentProperty = JSON.stringify(page.properties[property]);
          if (!propertyValues[page.id] || currentProperty !== propertyValues[page.id][property]) {
            propertyChangeFound = true;
            propertyValues[page.id] = {
              ...propertyValues[page.id],
              [property]: currentProperty,
            };
          }
        }
        if (!propertyChangeFound) {
          continue;
        }
      }

      const meta = this.generateMeta(
        page,
        constants.types.PAGE,
        constants.timestamps.LAST_EDITED_TIME,
        constants.summaries.PAGE_UPDATED,
        true,
      );

      this.$emit(page, meta);
    }

    this.setLastUpdatedTimestamp(newLastUpdatedTimestamp);
    this._setPropertyValues(propertyValues);
  },
  sampleEmit,
};
