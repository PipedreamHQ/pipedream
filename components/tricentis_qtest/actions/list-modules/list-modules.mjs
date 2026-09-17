import tricentisQtest from "../../tricentis_qtest.app.mjs";

function flattenModules(modules) {
  return (modules ?? []).flatMap(({
    id, name, children,
  }) => [
    {
      id,
      name,
    },
    ...flattenModules(children),
  ]);
}

export default {
  key: "tricentis_qtest-list-modules",
  name: "List Modules",
  description: "List all modules in a qTest project, including nested submodules. Use this to find module IDs to use as the Parent ID when creating requirements. Example: `projectId: 1` → returns `[{id: 10, name: \"Authentication\"}, {id: 11, name: \"Checkout\"}]`. [See the documentation](https://docs.tricentis.com/qtest-saas/content/apis/apis/module_apis.htm#get-all-modules-under-root-or-a-specific-module)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tricentisQtest,
    projectId: {
      propDefinition: [
        tricentisQtest,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tricentisQtest.getModules({
      projectId: this.projectId,
      $,
    });
    const modules = flattenModules(response);
    $.export("$summary", `Successfully fetched ${modules.length} module${
      modules.length === 1
        ? ""
        : "s"
    }`);
    return modules;
  },
};
