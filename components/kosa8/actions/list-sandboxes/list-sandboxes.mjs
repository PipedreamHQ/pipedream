import kosa8 from "../../kosa8.app.mjs";

export default {
  key: "kosa8-list-sandboxes",
  name: "List Sandboxes",
  description: "List the sandboxes in your kosa8 Cloud organization. [See the documentation](https://docs.kosa8.com/guides/cloud-openapi/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kosa8,
    includeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "Whether to include deleted sandboxes, e.g. `true`. Omit or set to `false` to exclude them.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kosa8.listSandboxes({
      $,
      params: this.includeDeleted
        ? {
          all: "1",
        }
        : undefined,
    });
    const count = response.sandboxes?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} sandbox${count === 1
      ? ""
      : "es"}`);
    return response;
  },
};
