import common from "../common/common-flex.mjs";
import app from "../../github.app.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getTimerAdditionalProps() {
      return {
        emitUpdates: {
          propDefinition: [
            app,
            "emitUpdates",
          ],
        },
      };
    },
    checkEventType(type) {
      return !this.eventTypes || this.eventTypes.includes(type);
    },
    async onWebhookTrigger(event) {
      const { body } = event;
      const action = body?.action;
      if (action && this.checkEventType(action)) {
        const item = this.getBodyItem();
        const ts = new Date(item.updated_at).valueOf() || Date.now();
        const id = `${action}_${ts}`;
        const summary = this.getSummary(action, item);

        this.$emit(body, {
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
      const shouldEmit = savedItems.length > 0;

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
    },
  },
};
