import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../opensrs.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    sortFn() {
      return;
    },
    isResourceRelevant() {
      return true;
    },
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
    },
    getJsonBody() {
      return {
        data_block: {
          dt_assoc: {
            item: [
              ...utils.addItem("protocol", constants.PROTOCOL.XCP),
              ...utils.addItem("object", constants.OBJECT_TYPE.EVENT),
              ...utils.addItem("action", constants.ACTION_TYPE.POLL),
              {
                "@_key": "attributes",
                "dt_assoc": {
                  item: [
                    ...utils.addItem("limit", constants.DEFAULT_LIMIT),
                  ],
                },
              },
            ],
          },
        },
      };
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        jsonBody: this.getJsonBody(),
      };
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run() {
    const {
      app,
      isResourceRelevant,
      getResourcesFnArgs,
      processResource,
    } = this;

    const { OPS_envelope: envelope } = await app.post(getResourcesFnArgs());

    const { item: items } = envelope?.body?.data_block?.dt_assoc || {};
    const attributes = items?.find((item) => item["@_key"] === "attributes");

    const { item: metadataItems } = attributes?.dt_assoc || {};
    const eventsMetadata = metadataItems?.find((item) => item["@_key"] === "events");

    const { item: eventItems } = eventsMetadata?.dt_array || {};

    const resources = eventItems.map(({ dt_assoc: { item: resourceItems } }) => {
      const data = resourceItems.reduce((acc, item) =>
        Object.assign(acc, {
          [item["@_key"]]: item.value,
        }), {});

      const objectData = resourceItems.find((item) => item["@_key"] === "object_data");
      const objectDataItems = objectData?.dt_assoc?.item.reduce((acc, item) =>
        Object.assign(acc, {
          [item["@_key"]]: item.value,
        }), {});
      return {
        ...data,
        objectData: objectDataItems,
      };
    });

    Array.from(resources)
      .reverse()
      .filter(isResourceRelevant)
      .forEach(processResource);
  },
};
