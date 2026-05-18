import beanstalkapp from "../../beanstalkapp.app.mjs";

export default {
  key: "beanstalkapp-list-user-id-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    beanstalkapp,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await beanstalkapp.propDefinitions.userId.options
        .call(this.beanstalkapp, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
