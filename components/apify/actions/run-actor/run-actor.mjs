/* eslint-disable no-unused-vars */
import apify from "../../apify.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { EVENT_TYPES } from "../../common/constants.mjs";

export default {
  key: "apify-run-actor",
  name: "Run Actor",
  description: "Performs an execution of a selected Actor in Apify. [See the documentation](https://docs.apify.com/api/v2#/reference/actors/run-collection/run-actor)",
  version: "0.0.7",
  type: "action",
  props: {
    apify,
    actorId: {
      propDefinition: [
        apify,
        "actorId",
      ],
      reloadProps: true,
    },
    runAsynchronously: {
      type: "boolean",
      label: "Run Asynchronously",
      description: "Set to `true` to run the Actor asynchronously",
      reloadProps: true,
    },
    build: {
      type: "string",
      label: "Build",
      description: "Specifies the Actor build to run. It can be either a build tag or build number.",
      optional: true,
      reloadProps: true,
    },
    timeout: {
      type: "string",
      label: "Timeout",
      description: "Optional timeout for the run, in seconds. By default, the run uses a timeout specified in the default run configuration for the Actor.",
      optional: true,
    },
    memory: {
      type: "string",
      label: "Memory",
      description: "Memory limit for the run, in megabytes. The amount of memory can be set to a power of 2 with a minimum of 128. By default, the run uses a memory limit specified in the default run configuration for the Actor.",
      optional: true,
    },
    maxItems: {
      type: "string",
      label: "Max Items",
      description: "The maximum number of items that the Actor run should return. This is useful for pay-per-result Actors, as it allows you to limit the number of results that will be charged to your subscription. You can access the maximum number of items in your Actor by using the ACTOR_MAX_PAID_DATASET_ITEMS environment variable.",
      optional: true,
    },
    maxTotalChargeUsd: {
      type: "string",
      label: "Max Total Charge USD",
      description: "Specifies the maximum cost of the Actor run. This parameter is useful for pay-per-event Actors, as it allows you to limit the amount charged to your subscription. You can access the maximum cost in your Actor by using the ACTOR_MAX_TOTAL_CHARGE_USD environment variable.",
      optional: true,
    },
    webhook: {
      type: "string",
      label: "Webhook",
      description: "Specifies optional webhook associated with the Actor run, which can be used to receive a notification e.g. when the Actor finished or failed.",
      optional: true,
      reloadProps: true,
    },
  },
  methods: {
    getType(type) {
      return [
        "string",
        "object",
        "integer",
        "boolean",
      ].includes(type)
        ? type
        : "string[]";
    },
    async getSchema(buildId) {
      const { data: { inputSchema } } = await this.apify.getBuild(buildId);
      return JSON.parse(inputSchema);
    },
    async prepareData(data) {
      const newData = {};

      const { properties } = await this.getSchema(this.buildId);
      for (const [
        key,
        value,
      ] of Object.entries(data)) {
        const editor = properties[key].editor;
        newData[key] = (Array.isArray(value))
          ? value.map((item) => this.setValue(editor, item))
          : value;
      }
      return newData;
    },
    prepareOptions(value) {
      let options = [];
      if (value.enum && value.enumTitles) {
        for (const [
          index,
          val,
        ] of value.enum.entries()) {
          if (val) {
            options.push({
              value: val,
              label: value.enumTitles[index],
            });
          }
        }
      }
      return options.length
        ? options
        : undefined;
    },
    setValue(editor, item) {
      switch (editor) {
      case "requestListSources" : return {
        url: item,
      };
      case "pseudoUrls" : return {
        purl: item,
      };
      case "globs" : return {
        glob: item,
      };
      default: return item;
      }
    },
  },
  async additionalProps() {
    const props = {};
    const { actorId, build } = this;
    if (this.actorId) {
      const apifyClient = this.apify._apifyClient();
      const actor = await apifyClient.actor(actorId).get();
      try {
        let buildId
        // If user specified a build, use it, otherwise use the latest build
        if (build) {
          const selectedBuild = actor.taggedBuilds && actor.taggedBuilds[build];
          if (!selectedBuild) {
            throw new Error(`Build with tag "${build}" not found for Actor with ID "${actorId}".`);
          }
          buildId = selectedBuild.buildId;
        } else {
          const defaultBuild = await apifyClient.actor(actorId).defaultBuild();
          if (!defaultBuild) {
            throw new Error(`No default build found for Actor with ID "${actorId}". Please specify a build.`);
          }
          buildId = defaultBuild.id; // Use the default build
        }

        const {
          properties, required: requiredProps = [],
        } = await this.getSchema(buildId);

        for (const [
          key,
          value,
        ] of Object.entries(properties)) {
          if (value.editor === "hidden") continue;

          props[key] = {
            type: this.getType(value.type),
            label: value.title,
            description: value.description,
            optional: !requiredProps.includes(key),
          };
          const options = this.prepareOptions(value);
          if (options) props[key].options = options;
          if (value.default) {
            props[key].description += ` Default: \`${JSON.stringify(value.default)}\``;
            if (props[key].type !== "object") { // default values don't work properly for object props
              props[key].default = value.default;
            }
          }
        }
      } catch {
        props.properties = {
          type: "object",
          label: "Properties",
          description: "Properties to set for this Actor",
        };
      }
      if (this.runAsynchronously) {
        props.outputRecordKey = {
          type: "string",
          label: "Output Record Key",
          description: "Key of the record from run's default key-value store to be returned in the response. By default, it is OUTPUT.",
          optional: true,
        };
      } else {
        props.waitForFinish = {
          type: "string",
          label: "Wait For Finish",
          description: "The maximum number of seconds the server waits for the run to finish. By default, it is 0, the maximum value is 60. If the build finishes in time then the returned run object will have a terminal status (e.g. SUCCEEDED), otherwise it will have a transitional status (e.g. RUNNING).",
          optional: true,
        };
      }
    }
    if (this.webhook) {
      props.eventTypes = {
        type: "string[]",
        label: "Event Types",
        description: "The types of events to send to the webhook",
        options: EVENT_TYPES,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      getType,
      getSchema,
      prepareOptions,
      setValue,
      prepareData,
      apify,
      actorId,
      buildId,
      properties,
      runAsynchronously,
      outputRecordKey,
      timeout,
      memory,
      maxItems,
      maxTotalChargeUsd,
      waitForFinish,
      webhook,
      eventTypes,
      ...data
    } = this;

    const fn = runAsynchronously
      ? apify.runActorAsynchronously
      : apify.runActor;

    const response = await fn({
      actorId,
      data: properties
        ? parseObject(properties)
        : await prepareData(data),
      params: {
        outputRecordKey,
        timeout,
        memory,
        maxItems,
        maxTotalChargeUsd,
        waitForFinish,
        webhooks: webhook
          ? btoa(JSON.stringify([
            {
              eventTypes,
              requestUrl: webhook,
            },
          ]))
          : undefined,
      },
    });
    const summary = this.runAsynchronously
      ? `Successfully started Actor run with ID: ${response.data.id}`
      : `Successfully ran Actor with ID: ${this.actorId}`;
    $.export("$summary", `${summary}`);
    return response;
  },
};
