import visualping from "../../visualping.app.mjs";
import {
  DEFAULT_JOB_FIELDS, normalizeJob, pluckFields,
} from "../../common/utils.mjs";

export default {
  key: "visualping-get-job",
  name: "Get Job Details By Id",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Gets the full details of one Visualping job by id — schedule, trigger,"
    + " notification config, crop region, and change-detection history."
    + " Use **Find Jobs** first to locate the job id if you don't already have it."
    + " Example: to confirm a job's check interval after creating it, call with the"
    + " `jobId` returned by **Create A New Job** → returns the full job object"
    + " including `interval`, `trigger`, `mode`, and `active`."
    + " Pass `fields` to return only the fields you need."
    + " [See the docs here](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs~1%7BjobId%7D/get)",
  type: "action",
  ai: "optimized",
  props: {
    visualping,
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
      optional: true,
    },
    jobId: {
      propDefinition: [
        visualping,
        "jobId",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      optional: true,
      description: "Field names to return (`id` is always included)."
        + " Omit to get the full job object (today's default output)."
        + " A useful compact set: `" + DEFAULT_JOB_FIELDS.join("`, `") + "`.",
    },
  },
  async run({ $ }) {
    const {
      visualping,
      workspaceId,
      jobId,
      fields,
    } = this;

    const response = normalizeJob(await visualping.getJob({
      workspaceId,
      jobId,
    }));

    const result = fields?.length
      ? pluckFields(response, fields)
      : response;

    $.export("$summary", `Job with id ${jobId} was successfully fetched!`);
    return result;
  },
};
