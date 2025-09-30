import app from "../../vitel_phone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "vitel_phone-create-call-report",
  name: "Create Call Report",
  description: "Create a call report. [See the documentation](https://www.vitelglobal.com)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    line: {
      type: "string",
      label: "Line",
      description: "Logged in user extension",
    },
    startdate: {
      type: "string",
      label: "Start Date",
      description: "Start date for the report",
    },
    enddate: {
      type: "string",
      label: "End Date",
      description: "End date for the report",
    },
  },
  methods: {
    createCallReport(args = {}) {
      return this.app.makeRequest({
        path: "/vitelglobal_callrecords.php",
        ...args,
      });
    },
    summary(resp) {
      const response = utils.checkResponse(resp);
      const [
        record,
      ] = response.callrecords;
      if (record?.error) {
        throw new Error(JSON.stringify(record?.error, null, 2));
      }
      return `Successfully created call report with ${record?.totalnoofrecords[0]} total number of records`;
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      createCallReport,
      summary,
      ...params
    } = this;

    return createCallReport({
      step,
      params,
      summary,
    });
  },
};
