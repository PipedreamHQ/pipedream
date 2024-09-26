/* eslint-disable no-unused-vars */
import apify from "../../apify.app.mjs";

export default {
  key: "apify-run-actor",
  name: "Run Actor",
  description: "Performs an execution of a selected actor in Apify. [See the documentation](https://docs.apify.com/api/v2#/reference/actors/run-collection/run-actor)",
  version: "0.0.1",
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
    async getSchema() {
      const { data: { items: builds } } = await this.apify.listBuilds(this.actorId);
      const buildId = builds.at(-1).id;
      const { data: { inputSchema } } = await this.apify.getBuild(buildId);
      return JSON.parse(inputSchema);
    },
    async prepareData(data) {
      const newData = {};

      const { properties } = await this.getSchema();
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
    if (this.actorId) {
      const {
        properties, required: requiredProps = [],
      } = await this.getSchema();

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
      }
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
      ...data
    } = this;

    const response = await apify.runActor({
      actorId,
      data: await prepareData(data),
    });
    $.export("$summary", `Successfully started actor run with ID: ${response.data.id}`);
    return response;
  },
};
