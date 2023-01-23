import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Link Created",
  version: "0.0.3",
  key: "curated-new-link-created",
  description: "Emit new event when a link is created.",
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
        summary: `New link created with id ${data.id}`,
        ts: new Date(),
      });
    },
    async getResources(args = {}) {
      const links = await this.curated.getLinks({
        ...args,
        publicationId: this.publicationId,
      });

      return {
        resources: links,
      };
    },
  },
};
