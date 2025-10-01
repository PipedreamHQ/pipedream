import github from "../../github.app.mjs";

export default {
  key: "github-list-releases",
  name: "List Releases",
  description: "List releases for a repository [See the documentation](https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#list-releases)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
  },
  async run({ $ }) {
    let page = 1;
    const perPage = 100;
    let allReleases = [];

    while (true) {
      const releases = await this.github.listReleases({
        repoFullname: this.repoFullname,
        perPage: perPage,
        page: page,
      });

      if (releases.length === 0) {
        break;
      }

      allReleases = allReleases.concat(releases);
      page += 1;
    }

    $.export("$summary", `Successfully retrieved ${allReleases.length} releases.`);

    return allReleases;
  },
};
