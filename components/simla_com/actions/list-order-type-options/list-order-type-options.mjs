import simla_com from "../../simla_com.app.mjs";

export default {
  key: "simla_com-list-order-type-options",
  name: "List Order Type Options",
  description: "Retrieves available options for the Order Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    simla_com,
  },
  async run({ $ }) {
    const options = await simla_com.propDefinitions.orderType.options.call(this.simla_com);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
