import summit from "../../summit.app.mjs";

export default {
  key: "summit-run-model",
  name: "Run Model",
  description: "Executes a model within Summit and captures the response fields. [See the documentation](https://summit.readme.io/reference/model-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    summit,
    model: {
      propDefinition: [
        summit,
        "model",
      ],
      reloadProps: true,
    },
    experimentalFlatten: {
      type: "integer",
      label: "Experimental Flatten",
      description: "This allows you to choose the index of the column you'd like to pull from the grid. -1 is the last column, which is useful for grabbing the last slice of a time series model, like a forecast.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.model) {
      return props;
    }
    const { parameters } = await this.summit.getModel({
      model: this.model,
    });
    for (const parameter of parameters) {
      props[parameter.name] = {
        type: "string",
        label: `${parameter.name}`,
        default: `${parameter.default_value}`,
      };
      if (parameter.value_choices) {
        props[parameter.name].options = parameter.value_choices;
      }
    }
    return props;
  },
  async run({ $ }) {
    const { parameters } = await this.summit.getModel({
      model: this.model,
    });
    const parametersObj = {};
    for (const parameter of parameters) {
      parametersObj[parameter.name] = this[parameter.name];
    }
    const data = {
      parameters: parametersObj,
    };
    if (this.experimentalFlatten !== undefined) {
      data.output = {
        "__experimental_flatten": this.experimentalFlatten,
      };
    }
    const response = await this.summit.runModel({
      $,
      model: this.model,
      data,
    });
    $.export("$summary", `Successfully executed model \`${(this.model).split("/").pop()}\``);
    return response;
  },
};
