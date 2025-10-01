import app from "../../sigma.app.mjs";

export default {
  key: "sigma-list-datasets",
  name: "List Datasets",
  description: "Returns a list of available datasets. [See the documentation](https://docs.sigmacomputing.com/#get-/v2/datasets)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  methods: {
    listDatasets(args = {}) {
      return this.app._makeRequest({
        path: "/datasets",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      listDatasets,
    } = this;

    const response = await app.paginate({
      resourcesFn: listDatasets,
      resourcesFnArgs: {
        $,
      },
      resourceName: "entries",
    });
    $.export("$summary", `Successfully listed \`${response.length}\` dataset(s)`);
    return response;
  },
};
