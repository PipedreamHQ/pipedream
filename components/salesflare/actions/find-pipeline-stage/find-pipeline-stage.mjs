import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-find-pipeline-stage",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Find Pipeline Stage",
  description: "Finds pipeline stages according to props configured, if no prop configured returns all stages [See the docs here](https://api.salesflare.com/docs#operation/getStages)",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "pipelineStageId",
      ],
    },
    pipeline: {
      propDefinition: [
        app,
        "pipelineId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run ({ $ }) {
    const pairs = {
      pipeline: "pipeline",
    };
    const params = utils.extractProps(this, pairs);
    const resp = await this.app.getPipelineStages({
      $,
      params,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${resp.length} pipeline stage${resp.length != 1 ? "s" : ""} has been found.`);
    return resp;
  },
};
