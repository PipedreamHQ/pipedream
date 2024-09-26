import constants from "../../common/constants.mjs";
import common from "../common/timer-based.mjs";

const { props: { outgrow } } = common;

export default {
  ...common,
  key: "outgrow-new-lead",
  name: "New Lead",
  description: "Emit new event when a new lead is created.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    contentId: {
      propDefinition: [
        outgrow,
        "contentId",
      ],
    },
  },
  hooks: {
    async activate() {
      const leads = await this.outgrow.getLeads({
        contentId: this.contentId,
      });

      this.processEvents(leads);
    },
    async deactivate() {
      this.setLastCreatedAt(null);
    },
  },
  methods: {
    setLastCreatedAt(createdAt) {
      this.db.set(constants.LAST_CREATED_AT, createdAt);
    },
    getLastCreatedAt() {
      return this.db.get(constants.LAST_CREATED_AT);
    },
    isResourceRelevant(resource) {
      const lastCreatedAt = this.getLastCreatedAt();
      if (!lastCreatedAt) {
        return true;
      }
      const { created_at: createdAt } = resource;
      return Date.parse(createdAt) > Date.parse(lastCreatedAt);
    },
    processEvents(resources) {
      const filteredResources = resources.filter(this.isResourceRelevant);

      filteredResources.forEach((resource) => {
        this.$emit(resource, {
          id: resource.id,
          ts: Date.parse(resource.created_at),
          summary: `New Lead ${resource.id}`,
        });
      });

      const [
        { created_at: createdAt } = {},
      ] = filteredResources;

      if (createdAt) {
        this.setLastCreatedAt(createdAt);
      }
    },
  },
  async run({ $ }) {
    const leads = await this.outgrow.getLeads({
      $,
      contentId: this.contentId,
    });
    this.processEvents(leads);
  },
};
