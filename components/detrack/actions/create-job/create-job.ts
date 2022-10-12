import detrack from "../../app/detrack.app";
import { defineAction } from "@pipedream/types";
import { CreateJobParams } from "../../common/types";

export default defineAction({
  name: "Create Job",
  description:
    "Create a job [See docs here](https://detrackapiv2.docs.apiary.io/#reference/jobs/list-create/create)",
  key: "detrack-create-job",
  version: "0.0.1",
  type: "action",
  props: {
    detrack,
    jobParams: {
      type: "object",
      label: "Job Params",
      description: "The parameters to pass in the request body. [See the docs for more info.](https://detrackapiv2.docs.apiary.io/#reference/jobs/list-create/create)",
    },
  },
  async run({ $ }): Promise<any> {
    const params: CreateJobParams = {
      $,
      data: JSON.stringify({
        data: this.jobParams
      }),
    };

    const response = await this.detrack.createJob(params);

    $.export("$summary", "Created job successfully");

    return response;
  },
});
