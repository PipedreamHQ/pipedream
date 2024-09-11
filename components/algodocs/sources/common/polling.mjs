import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../algodocs.app.mjs";
import constants from "../../common/constants.mjs";

export default {
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
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
    },
    extractorId: {
      propDefinition: [
        app,
        "extractorId",
      ],
    },
  },
  hooks: {
    deploy() {
      this.setIsFirstRun(true);
    },
  },
  methods: {
    setIsFirstRun(value) {
      this.db.set(constants.IS_FIRST_RUN, value);
    },
    getIsFirstRun() {
      return this.db.get(constants.IS_FIRST_RUN);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setLastDateAt(value) {
      this.db.set(constants.LAST_DATE_AT, value);
    },
    getLastDateAt() {
      return this.db.get(constants.LAST_DATE_AT);
    },
    isResourceRelevant() {
      return true;
    },
    getResourcesFn() {
      return this.app.getExtractedDataOfMultipleDocuments;
    },
    getResourcesFnArgs(isFirstRun) {
      const {
        getLastDateAt,
        extractorId,
        folderId,
      } = this;

      const params = {
        folder_id: folderId,
        date: getLastDateAt(),
      };

      return {
        debug: true,
        extractorId,
        params: {
          ...params,
          limit: isFirstRun
            ? constants.DEFAULT_LIMIT
            : constants.DEFAULT_MAX,
        },
      };
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run() {
    const {
      getIsFirstRun,
      getResourcesFn,
      getResourcesFnArgs,
      processResource,
      isResourceRelevant,
    } = this;

    const isFirstRun = getIsFirstRun();
    const resourcesFn = getResourcesFn();
    const resources = await resourcesFn(getResourcesFnArgs(isFirstRun));

    Array.from(resources)
      .reverse()
      .filter(isResourceRelevant)
      .forEach(processResource);

    const [
      lastResource,
    ] = Array.from(resources).slice(-1);
    if (lastResource) {
      this.setLastDateAt(lastResource.uploadedAt);
    }

    if (isFirstRun) {
      this.setIsFirstRun(false);
    }
  },
};
