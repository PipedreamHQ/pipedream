export const data = {
  "key": "v-146a1089",
  "path": "/code/",
  "title": "Overview",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "git": {
    "updatedTime": 1643303479000,
    "contributors": [
      {
        "name": "Dylan Pierce",
        "email": "me@dylanjpierce.com",
        "commits": 2
      },
      {
        "name": "Pravin",
        "email": "pravin@pipedream.com",
        "commits": 1
      }
    ]
  },
  "filePathRelative": "code/README.md"
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
