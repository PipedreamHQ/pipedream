import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Email Unsubscribed",
  version: "0.0.3",
  key: "curated-new-email-unsubscribed",
  description: "Emit new event when an email is unsubscribed.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    publicationId: {
      propDefinition: [
        common.props.curated,
        "publicationId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New email unsubscribed with id ${data.id}`,
        ts: new Date(),
      });
    },
    async getResources(args = {}) {
      const {
        page, data,
      } = await this.curated.getUnsubscribers({
        ...args,
        publicationId: this.publicationId,
      });

      return {
        currentPage: page,
        resources: data,
      };
    },
  },
};
