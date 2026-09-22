import setmoreappointments from "../../setmoreappointments.app.mjs";

export default {
  key: "setmoreappointments-list-service-key-options",
  name: "List Service Options",
  description: "Retrieves available options for the Service field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    setmoreappointments,
  },
  async run({ $ }) {
    const options = await setmoreappointments.propDefinitions.serviceKey.options
      .call(this.setmoreappointments);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
