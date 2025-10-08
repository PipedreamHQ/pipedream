import printnode from "../../printnode.app.mjs";

export default {
  key: "printnode-list-print-jobs",
  name: "List Print Jobs",
  description: "Returns a list of all print jobs that have been submitted. [See the documentation](https://www.printnode.com/en/docs/api/curl#printjob-viewing)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    printnode,
  },
  async run({ $ }) {
    const response = await this.printnode.listPrintJobs({
      $,
    });

    $.export("$summary", "Successfully retrieved print jobs");
    return response;
  },
};
