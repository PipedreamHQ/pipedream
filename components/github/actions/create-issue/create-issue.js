const github = require('../../github.app.js')
const { Octokit } = require('@octokit/rest')

module.exports = {
  key: "github-create-issue",
  name: "Create Issue",
  version: "0.0.2",
  type: "action",
  props: {
    github,
    repoFullName: { propDefinition: [github, "repoFullName"] },
    title: "string",
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token
    })
    
    return (await octokit.issues.create({
      owner: this.repoFullName.split("/")[0],
      repo: this.repoFullName.split("/")[1],
      title: this.title,
    })).data
  },
}