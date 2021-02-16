const github = require('../../github.app.js')
const { Octokit } = require('@octokit/rest')

module.exports = {
  key: "github-search-issues-and-pull-requests",
  name: "Search Issues and Pull Requests",
  description: "Find issues by state and keyword. This method returns up to 100 results per page.",
  version: "0.0.4",
  type: "action",
  props: {
    github,
    q: { propDefinition: [github, "q"] },
    sort: { propDefinition: [github, "sortIssues"] },
    order: { propDefinition: [github, "order"] },
    per_page: { propDefinition: [github, "per_page"] },
    page: { propDefinition: [github, "page"] },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token
    })
    
    return (await octokit.search.issuesAndPullRequests({
      q: this.q,
      sort: this.sort,
      order: this.order,
      per_page: this.per_page,
      page: this.page,
    })).data
  },
}