const github = require('../../github.app.js')
const { Octokit } = require('@octokit/rest')

module.exports = {
  key: "github-search-issues-and-pull-requests",
  name: "Search Issues and Pull Requests",
  description: "Find issues by state and keyword.",
  version: "0.0.15",
  type: "action",
  props: {
    github,
    q: { propDefinition: [github, "q_issues_and_pull_requests"] },
    sort: { propDefinition: [github, "sortIssues"] },
    order: { propDefinition: [github, "order"] },
    paginate: { propDefinition: [github, "paginate"] },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token
    })
    
    if(this.paginate) {
      return await octokit.paginate(octokit.search.issuesAndPullRequests, { 
        q: this.q,
        sort: this.sort,
        order: this.order,
        per_page: 100,
      })
    } else {
      return (await octokit.search.issuesAndPullRequests({
        q: this.q,
        sort: this.sort,
        order: this.order,
        per_page: 100,
      })).data.items
    }
  },
}