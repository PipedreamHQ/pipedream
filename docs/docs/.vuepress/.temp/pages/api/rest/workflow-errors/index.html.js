export const data = {
  "key": "v-86eff03a",
  "path": "/api/rest/workflow-errors/",
  "title": "REST API example: Workflow errors",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "List the last 100 errors from the REST API",
      "slug": "list-the-last-100-errors-from-the-rest-api",
      "children": []
    },
    {
      "level": 2,
      "title": "Forward errors for one workflow to another workflow",
      "slug": "forward-errors-for-one-workflow-to-another-workflow",
      "children": []
    }
  ],
  "git": {
    "updatedTime": 1622852198000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 3
      }
    ]
  },
  "filePathRelative": "api/rest/workflow-errors/README.md"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
