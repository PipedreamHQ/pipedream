import axios from "@pipedream/platform";
import affinity from "../../affinity.app.mjs";

export default {
  key: "affinity-new-opportunity",
  name: "New Opportunity Created",
  description: "Emits a new event when a new opportunity is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    affinity,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    opportunityTitle: {
      propDefinition: [
        affinity,
        "opportunityTitle",
      ],
    },
    opportunityDescription: {
      propDefinition: [
        affinity,
        "opportunityDescription",
      ],
    },
  },
  methods: {
    _getOpportunityId() {
      return this.db.get("opportunityId") || null;
    },
    _setOpportunityId(id) {
      this.db.set("opportunityId", id);
    },
  },
  async run() {
    const opportunityDetails = {
      name: this.opportunityTitle,
      description: this.opportunityDescription,
    };
    const { data } = await this.affinity.createEntity(opportunityDetails);
    const newOpportunityId = data.id;

    const lastOpportunityId = this._getOpportunityId();
    if (lastOpportunityId === newOpportunityId) {
      console.log("No new opportunity created.");
      return;
    }

    this.$emit(data, {
      id: data.id,
      summary: `New opportunity created: ${data.name}`,
      ts: Date.now(),
    });

    this._setOpportunityId(newOpportunityId);
  },
};
