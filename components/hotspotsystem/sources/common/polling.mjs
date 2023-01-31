import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../hotspotsystem.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Hotspot System API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
  },
  methods: {
    getLastRegisteredAt() {
      return this.db.get(constants.LAST_REGISTERED_AT);
    },
    setLastRegisteredAt(value) {
      this.db.set(constants.LAST_REGISTERED_AT, value);
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta not implemented");
    },
    getDateField() {
      return constants.FIELDS.REGISTERED_AT;
    },
    async processEvents() {
      console.log("Retrieving historical events...");
      const stream = this.app.getResourcesStream({
        resourcesFn: this.getResourcesFn(),
        resourcesFnArgs: this.getResourcesFnArgs(),
        dateField: this.getDateField(),
        lastDate: this.getLastRegisteredAt(),
      });

      const resources = await utils.streamIterator(stream);

      const [
        lastResource,
      ] = resources;

      if (lastResource?.registered_at) {
        this.setLastRegisteredAt(lastResource?.registered_at);
      }

      resources
        .reverse()
        .forEach((resource) =>
          this.$emit(resource, this.generateMeta(resource)));
    },
  },
  async run() {
    await this.processEvents();
  },
};
