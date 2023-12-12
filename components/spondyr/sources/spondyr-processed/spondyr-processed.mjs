import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import spondyr from "../../spondyr.app.mjs";

export default {
  type: "source",
  name: "New Spondyr Processed",
  key: "spondyr-spondyr-processed",
  description: "Emit new event when a spondyr is processed. [See docs here](https://client.spondyr.io/#/Public/Public/Documentation?Section=status-api)",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    spondyr,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Spondyr API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    referenceId: {
      type: "string",
      label: "Reference Id",
      description: "The Reference Id of the Spondyr you want to get the status of.",
    },
  },
  methods: {
    async processEvent(item) {
      const {
        APIStatus,
        ReferenceID,
        CreatedDate,
      } = item;

      const dateTime = CreatedDate || new Date().getTime();
      this.$emit(item, {
        id: ReferenceID + APIStatus,
        summary: `Spondyr with ReferenceID ${ReferenceID} was successfully processed!`,
        ts: dateTime,
      });
    },
  },
  async run() {
    const response = await this.spondyr.getSpondyr({
      ReferenceID: this.referenceId,
      IncludeData: true,
    });

    if (response.APIStatus === "OK") {
      this.processEvent(response);
    }
  },
};

