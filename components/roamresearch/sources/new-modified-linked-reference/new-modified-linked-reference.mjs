import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../roamresearch.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "roamresearch-new-modified-linked-reference",
  name: "New Modified Linked Reference",
  description: "Emit new event for each new or modified linked reference in Roam Research.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    resourceType: {
      propDefinition: [
        app,
        "resourceType",
      ],
    },
    pageOrBlock: {
      propDefinition: [
        app,
        "pageOrBlock",
      ],
    },
  },
  methods: {
    getResourcesName() {
      return "result.:block/_refs";
    },
    getResourcesFn() {
      return this.app.pull;
    },
    getResourcesFnArgs() {
      const {
        resourceType,
        pageOrBlock,
      } = this;

      const attribute = resourceType === "page"
        ? ":node/title"
        : ":block/uid";

      return {
        data: {
          selector: `[${attribute} :block/string :block/order :edit/time {:block/_refs ...}]`,
          eid: `[${attribute} "${pageOrBlock}"]`,
        },
      };
    },
    generateMeta(resource) {
      const ts = resource[":edit/time"];
      return {
        id: ts,
        summary: `Link Reference: ${resource[":block/string"]}`,
        ts,
      };
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run() {
    const {
      getResourcesFn,
      getResourcesName,
      getResourcesFnArgs,
      processResource,
    } = this;

    const resourcesFn = getResourcesFn();
    const response = await resourcesFn(getResourcesFnArgs());
    const resources = utils.getNestedProperty(response, getResourcesName());

    if (!resources) {
      console.log("No resources found");
      return;
    }

    Array.from(resources)
      .reverse()
      .forEach(processResource);
  },
};
