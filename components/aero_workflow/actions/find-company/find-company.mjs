import app from "../../aero_workflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aero_workflow-find-company",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Find Company",
  description: "Finds companies with the given parameters [See the docs here](https://api.aeroworkflow.com/swagger/index.html)",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name",
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Is active",
      optional: true,
    },
  },
  async run ({ $ }) {
    const params = utils.extractProps(this);
    const resp = await this.app.findCompany({
      $,
      params,
    });
    const length = resp?.companies?.length;
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${length} compan${length == 1 ? "y" : "ies"} has been found.`);
    return resp;
  },
};
