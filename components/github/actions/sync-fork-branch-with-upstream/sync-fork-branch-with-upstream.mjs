import github from "../../github.app.mjs";

export default {
  key: "github-sync-fork-branch-with-upstream",
  name: "Sync Fork Branch with Upstream",
  description: "Sync a forked branch with the upstream branch. [See the documentation](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#sync-a-fork-branch-with-the-upstream-repository)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    branch: {
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      description: "The branch to sync with the upstream repository",
    },
  },
  methods: {
    async syncForkBranchWithUpstream({
      repoFullname, ...args
    }) {
      const response = await this.github._client().request(`POST /repos/${repoFullname}/merge-upstream`, args);
      return response.data;
    },
  },
  async run({ $ }) {
    const response = await this.syncForkBranchWithUpstream({
      repoFullname: this.repoFullname,
      data: {
        branch: this.branch.split("/")[1],
      },
    });

    $.export("$summary", "Successfully synced fork branch with upstream repository");

    return response;
  },
};
