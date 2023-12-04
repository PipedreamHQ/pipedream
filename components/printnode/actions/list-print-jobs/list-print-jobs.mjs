import printnode from "../../printnode.app.mjs";

export default {
  key: "printnode-list-print-jobs",
  name: "List Print Jobs",
  description: "Returns a list of all print jobs that have been submitted. [See the documentation](https://www.printnode.com/en/docs/api/curl#list-printjobs)",
  version: "0.0.1",
  type: "action",
  props: {
    printnode,
    dateRange: {
      propDefinition: [
        printnode,
        "dateRange",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printnode.listPrintJobs({
      dateRange: this.dateRange,
    });

    $.export("$summary", "Successfully retrieved the list of print jobs");
    return response;
  },
};
