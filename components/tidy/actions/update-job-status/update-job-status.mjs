import tidy from "../../tidy.app.mjs";

export default {
  key: "tidy-update-job-status",
  name: "Update Job Status",
  description: "Updaets a job's status in Tidy. [See the documentation](https://help.tidy.com/update-a-job)",
  version: "0.0.1",
  type: "action",
  props: {
    tidy,
  },
  async run() {
  },
};
