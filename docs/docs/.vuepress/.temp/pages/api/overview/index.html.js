export const data = {
  "key": "v-5ed9dc70",
  "path": "/api/overview/",
  "title": "API Overview",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "git": {
    "updatedTime": 1622849086000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 3
      },
      {
        "name": "Pravin",
        "email": "pravin@pipedream.com",
        "commits": 1
      }
    ]
  },
  "filePathRelative": "api/overview/README.md"
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
