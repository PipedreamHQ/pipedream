export const data = {
  "key": "v-11d99008",
  "path": "/quickstart/hello-name/",
  "title": "hello ${name}!",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 3,
      "title": "Pass data to an HTTP triggered workflow via query parameters",
      "slug": "pass-data-to-an-http-triggered-workflow-via-query-parameters",
      "children": []
    },
    {
      "level": 3,
      "title": "Inspect the query data sent to the workflow",
      "slug": "inspect-the-query-data-sent-to-the-workflow",
      "children": []
    },
    {
      "level": 3,
      "title": "Customize the HTTP response using data sent to the workflow",
      "slug": "customize-the-http-response-using-data-sent-to-the-workflow",
      "children": []
    }
  ],
  "git": {
    "updatedTime": 1622614367000,
    "contributors": [
      {
        "name": "Pravin",
        "email": "psavkar@yahoo.com",
        "commits": 13
      }
    ]
  },
  "filePathRelative": "quickstart/hello-name/README.md"
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
