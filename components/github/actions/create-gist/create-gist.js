const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-create-gist",
  name: "Create Gist",
  description: "Create gist in connected Github account.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
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
        "name",
      ],
      description: "The gist file name.",
      optional: false,
    },
    content: {
      propDefinition: [
        github,
        "content",
      ],
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Flag indicating whether the gist is public.",
      optional: true,
      default: false,
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const name = this.name.replace("\"", "'");
    const file = JSON.parse(`{ "${name}": { "content": "" }}`);
    file[name].content = this.content;
    const result = await this.github._withRetries(
      () => octokit.gists.create({
        description: this.description,
        files: file,
        public: this.public,
      }),
    );
    return result.data;
  },
};
