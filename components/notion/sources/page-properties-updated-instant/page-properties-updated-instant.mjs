import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "notion-page-properties-updated-instant",
  name: "Page Properties Updated (Instant)",
  description: "Emit new event each time a page property is updated in a data source. For use with Page Properties Updated event type. Webhook must be set up in Notion. [See the documentation](https://developers.notion.com/reference/webhooks#step-1-creating-a-webhook-subscription)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    dataSourceId: {
      propDefinition: [
        common.props.notion,
        "dataSourceId",
      ],
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description: "Only emit events when one or more of the selected properties have changed",
      optional: true,
      async options() {
        try {
          const { properties } = await this.notion.retrieveDataSource(this.dataSourceId);
          const propEntries = Object.entries(properties);
          return propEntries.map((prop) => ({
            label: prop[1].name,
            value: prop[1].id,
          }));
        } catch (error) {
          console.log(error);
          return [];
        }
      },
    },
  },
  methods: {
    ...common.methods,
    _generateMeta(page) {
      const { id } = page;
      const title = this.notion.extractPageTitle(page);
      const ts = Date.now();
      return {
        id: `${id}-${ts}`,
        summary: `Page updated: ${title}`,
        ts,
      };
    },
    async processEvent(event) {
      if (event?.type !== "page.properties_updated") {
        console.log(`Skipping event type: ${event?.type}`);
        return;
      }

      if (event.data.parent.data_source_id !== this.dataSourceId) {
        console.log(`Skipping event for data source: ${event.data.parent.data_source_id}`);
        return;
      }

      const updatedProperties = event.data.updated_properties;
      if (!updatedProperties?.length) {
        return;
      }

      let propertyHasChanged = false;
      for (const propertyName of updatedProperties) {
        if (!this.properties || this.properties.includes(propertyName)) {
          propertyHasChanged = true;
        }
      }

      if (!propertyHasChanged) {
        return;
      }

      const page = await this.notion.retrievePage(event.entity.id);

      const meta = this._generateMeta(page);
      this.$emit({
        ...event,
        page,
      }, meta);
    },
  },
  sampleEmit,
};
