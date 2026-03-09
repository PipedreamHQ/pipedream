import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import activecampaign from "../../activecampaign.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Automation Webhook",
  key: "activecampaign-new-automation-webhook",
  description: "Emit new event each time an automation sends out webhook data.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    automations: {
      propDefinition: [
        activecampaign,
        "automations",
      ],
    },
  },
  methods: {
    isWatchedAutomation(automation) {
      return (
        this.automations?.length === 0 ||
        this.automations?.includes(automation.id)
      );
    },
    isAutomationRelevant(automation) {
      if (!this.isWatchedAutomation(automation)) {
        return false;
      }

      const entered = this.db.get(automation.id) || 0; // number of times automation has run

      if (parseInt(automation.entered) <= entered) {
        return false;
      }

      this.db.set(automation.id, parseInt(automation.entered));

      return true;
    },
    getMeta(automation) {
      return {
        id: `${automation.id}${automation.entered}`,
        summary: automation.name,
        ts: Date.now(),
      };
    },
  },
  async run() {
    let resources = [];
    let offset = 0;
    let total = 1;

    do {
      const response =
        await this.activecampaign.paginateResources({
          requestFn: this.activecampaign.listAutomations,
          requestArgs: {
            params: {
              offset,
            },
          },
          resourceName: "automations",
          mapper: (resource) => resource,
        });

      const { options: nextResources } = response;
      ({
        offset, total,
      } = response.context);

      resources = resources.concat(nextResources);

      resources.forEach((resource) => {
        if (this.isAutomationRelevant(resource)) {
          this.$emit(resource, this.getMeta(resource));
        }
      });

    } while (resources.length < total);
  },
};
