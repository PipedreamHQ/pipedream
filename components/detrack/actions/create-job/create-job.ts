import detrack from "../../app/detrack.app";
import { defineAction } from "@pipedream/types";
import {
  CreateJobParams,
} from "../../common/types";

export default defineAction({
  name: "Create Job",
  description:
    "Create a job [See docs here](https://detrackapiv2.docs.apiary.io/#reference/jobs/list-create/create)",
  key: "detrack-create-job",
  version: "0.0.1",
  type: "action",
  props: {
    detrack,
  },
  async run({ $ }): Promise<any> {
    const params: CreateJobParams = {
      $,
    };

    const response = await this.detrack.createJob(params);

    $.export("$summary", "Created job successfully");

    return response;
  },
});
