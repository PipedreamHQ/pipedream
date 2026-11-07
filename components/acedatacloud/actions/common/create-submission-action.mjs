import { apiError } from "../../common/utils.mjs";

/**
 * Build an asynchronous Pipedream submission action from one service request.
 * @param {Object} config - Action metadata and a pure payload builder.
 * @returns {Object} A Pipedream action with one paid request per run.
 */
export const createSubmissionAction = ({
  acedatacloud,
  key,
  name,
  description,
  path,
  props,
  buildData,
  version = "0.0.1",
}) => ({
  key,
  name,
  description,
  version,
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    ...props,
  },
  async run({ $ }) {
    const data = buildData(this);
    let response;
    try {
      response = await this.acedatacloud.request({
        $,
        path,
        data: {
          ...data,
          async: true,
        },
      });
    } catch (error) {
      throw apiError(error, true);
    }
    if (typeof response?.task_id !== "string" || !response.task_id) {
      throw new Error(`${name} returned no task ID. Check task history before submitting again.`);
    }
    $.export("$summary", `Submitted ${name} task ${response.task_id}; processing is pending`);
    return {
      ...response,
      state: "submitted",
    };
  },
});
