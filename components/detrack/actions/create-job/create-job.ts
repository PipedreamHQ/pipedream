import detrack from "../../app/detrack.app";
import { defineAction } from "@pipedream/types";
import {
  CreateJobParams, JobResponse,
} from "../../common/types";

export default defineAction({
  name: "Create Job",
  description:
    "Create a job [See docs here](https://detrackapiv2.docs.apiary.io/#reference/jobs/list-create/create)",
  key: "detrack-create-job",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    detrack,
    doNumber: {
      type: "string",
      label: "D.O Number",
    },
    address: {
      type: "string",
      label: "Address",
    },
    date: {
      type: "string",
      label: "Date",
    },
    simplifyResponse: {
      type: "boolean",
      label: "Simplify Response",
      description: "Whether to remove null and empty values from the response.",
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to pass in the request body. [See the docs for more info.](https://detrackapiv2.docs.apiary.io/#reference/jobs/list-create/create)",
      optional: true,
    },
  },
  async run({ $ }): Promise<JobResponse> {
    const params: CreateJobParams = {
      $,
      data: JSON.stringify({
        data: {
          do_number: this.doNumber,
          address: this.address,
          date: this.date,
          ...this.additionalOptions,
        },
      }),
    };

    const response: JobResponse = await this.detrack.createJob(params);
    const { data } = response;

    if (this.simplifyResponse) {
      Object.entries(data).forEach(([
        key,
        value,
      ]) => {
        if ([
          null,
          "",
        ].includes(value)) delete data[key];
      });
    }

    $.export("$summary", `Successfully created job with ID ${data.id}`);

    return response;
  },
});
