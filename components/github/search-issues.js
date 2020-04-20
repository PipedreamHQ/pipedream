const _ = require('lodash')
const axios = require('axios')
const pdsdk = require("@pipedreamhq/sdk")

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  name: "github-search",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    github: {
      type: "app",
      app: "github",
    },
    q: {
      type: "string",
      label: "Enter Keywords",
      description: `Required. The query contains one or more search keywords and qualifiers. Qualifiers allow you to limit your search to specific areas of GitHub. To learn more about the format of the query, see Constructing a search query. See "Searching issues and pull requests" for a detailed list of qualifiers.`,
    },
    sortIssues: {
      type: "string",
      label: "Sort",
      description: "Sorts the results of your query. Default: best match.",
      optional: true,
      async options(opts) {
        return [
        {
          label: "Created",
          value: "created",
        },
        {
          label: "Updated",
          value: "updated",
        },
        {
          label: "Interactions",
          value: "interactions",
        },
        {
          label: "Reactions",
          value: "reactions",
        },
        {
          label: "Reactions (+1)",
          value: "reactions-+1",
        },
        {
          label: "Reactions (-1)",
          value: "reactions--1",
        },
        {
          label: "Reactions (smile)",
          value: "reactions-smile",
        },
        {
          label: "Reactions (thinking face)",
          value: "reactions-thinking_face",
        },
        {
          label: "Reactions (heart)",
          value: "reactions-heart",
        },
        {
          label: "Reactions (tada)",
          value: "reactions-tada",
        },
        ]
      },
    },
    order: {
      type: "string",
      label: "Order",
      description: "Determines whether the first search result returned is the highest number of matches (desc) or lowest number of matches (asc). Default: desc",
      optional: true,
      async options(opts) { 
        return [
          {
            label: "Descending",
            value: "desc",
          },
          {
            label: "Ascending",
            value: "asc",
          },
        ]
      },
      default: "desc",
    },
    onlyNew: {
      type: "boolean",
      label: "Only Emit New Tweets",
      description: "This source only emits new tweets by default. Select false to emit all search result (note: duplicate tweets may be emitted).",
      default: true,
    },
  },
  async run(events) {
    //See the API docs here: https://developer.github.com/v3/search/#search-issues-and-pull-requests
    const config = {
      url: `https://api.github.com/search/issues`,
      params: {
        q: this.q,
        sort: this.sort,
        order: this.order,
      },
      headers: {
        Authorization: `Bearer ${this.github.$auth.oauth_access_token}`,
      },
    }
    const response = await axios(config)
    console.log(response)

    for(let i=0; i<response.items.length; i++) {
      this.$emit(response.items[i])
      pdsdk.sendEvent("enysoeoj1prwkkd", response.items[i])
      console.log(response.items[i])
      if(i < response.items.length-1){
        await snooze(1000)
      }
    }
  },
}