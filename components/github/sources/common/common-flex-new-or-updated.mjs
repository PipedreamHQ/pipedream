import common from "./common-flex.mjs";
import { getRelevantHeaders } from "./utils.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getTimerAdditionalProps() {
      return {
        emitUpdates: {
          type: "boolean",
          label: "Emit Updates",
          description:
              "If `false`, events will only be emitted for new items.",
          default: true,
          optional: true,
        },
      };
    },
    checkEventType(type) {
      return !this.eventTypes || this.eventTypes.includes(type);
    },
    async onWebhookTrigger(event) {
      const {
        body, headers,
      } = event;
      const action = body?.action;
      if (action && this.checkEventType(action)) {
        const item = this.getBodyItem(body);
        const ts = new Date(item.updated_at).valueOf() || Date.now();
        const id = `${action}_${ts}`;
        const summary = this.getSummary(action, item);

        this.$emit({
          ...body,
          ...getRelevantHeaders(headers),
        }, {
          id,
          summary,
          ts,
        });
      }
    },
    async onTimerTrigger() {
      const {
        emitUpdates, repoFullname,
      } = this;
      const sort = emitUpdates === false
        ? "created"
        : "updated";
      const items = await this.getPollingData({
        repoFullname,
        sort,
      });

      const savedItems = this._getSavedItems();
      const shouldEmit = this.shouldEmit();

      const tsProp = `${sort}_at`;
      const getFullId = (item) => `${item.id}_${item[tsProp]}`;

      items
        .filter((item) => !savedItems.includes(getFullId(item)))
        .forEach((item) => {
          const id = getFullId(item);

          if (shouldEmit) {
            const ts = new Date(item[tsProp]).valueOf();
            const summary = this.getSummary(sort, item);

            this.$emit(item, {
              id,
              summary,
              ts,
            });
          }
          savedItems.push(id);
        });

      this._setSavedItems(savedItems);
    },
  },
};
