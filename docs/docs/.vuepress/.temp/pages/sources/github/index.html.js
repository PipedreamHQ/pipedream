export const data = {
  "key": "v-38ce9d3c",
  "path": "/sources/github/",
  "title": "Example: Github",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "git": {
    "updatedTime": 1643178016000,
    "contributors": [
      {
        "name": "Pravin",
        "email": "pravin@pipedream.com",
        "commits": 1
      }
    ]
  },
  "filePathRelative": "sources/github/README.md"
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
