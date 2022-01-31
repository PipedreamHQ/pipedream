export const data = {
  "key": "v-3fe85c48",
  "path": "/new-feature-or-bug/",
  "title": "New Features / Bugs",
  "lang": "en-US",
  "frontmatter": {
    "prev": false,
    "next": false
  },
  "excerpt": "",
  "headers": [],
  "git": {
    "updatedTime": 1622853639000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 2
      }
    ]
  },
  "filePathRelative": "new-feature-or-bug/README.md"
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
