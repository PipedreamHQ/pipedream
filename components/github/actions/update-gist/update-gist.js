const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-update-gist",
  name: "Update Gist",
  description: "Update gist in connected Github account.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    gist: {
      propDefinition: [
        github,
        "gist",
      ],
    },
    description: {
      propDefinition: [
        github,
        "description",
      ],
      description: "Description of the gist.",
    },
    name: {
      propDefinition: [
        github,
        "gistFilename",
        (c) => ({
          gist: c.gist,
        }),
      ],
    },
    content: {
      propDefinition: [
        github,
        "content",
      ],
      description: "The gist file content. This parameter is ignored if `name` is not provided.",
      optional: true,
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    let file = undefined;
    if (this.name) {
      const name = this.name.replace("\"", "'");
      file = JSON.parse(`{ "${name}": { "content": "" }}`);
      file[name].content = this.content;
    }
    const result = await this.github._withRetries(
      () => octokit.gists.update({
        gist_id: this.gist,
        description: this.description,
        files: file,
      }),
    );
    return result.data;
  },
};
