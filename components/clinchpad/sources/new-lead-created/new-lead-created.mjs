import clinchpad from "../../clinchpad.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Lead Created ",
  version: "0.0.2",
  key: "clinchpad-new-lead-created",
  description: "Emit new event for each new created lead.",
  type: "source",
  dedupe: "unique",
  props: {
    clinchpad,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    pipelineId: {
      description: "The pipeline ID of the pipeline to which the leads belong to",
      propDefinition: [
        clinchpad,
        "pipelineId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data._id,
        summary: `New lead created with ID ${data._id}`,
        ts: new Date(),
      });
    },
  },
  hooks: {
    async deploy() {
      const leads = await this.clinchpad.getLeads({
        params: {
          pipeline_id: this.pipelineId,
          size: 10,
        },
      });

      leads.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 1;

    while (true) {
      const leads = await this.clinchpad.getLeads({
        params: {
          pipeline_id: this.pipelineId,
          page,
          size: 100,
        },
      });

      leads.reverse().forEach(this.emitEvent);

      if (leads.length < 100) {
        break;
      }

      page++;
    }
  },
};
