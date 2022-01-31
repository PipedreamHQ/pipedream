export const data = {
  "key": "v-7199170e",
  "path": "/code/nodejs/async/",
  "title": "Running asynchronous code in Node.js",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "The problem",
      "slug": "the-problem",
      "children": []
    },
    {
      "level": 2,
      "title": "Solutions",
      "slug": "solutions",
      "children": [
        {
          "level": 3,
          "title": "await all Promises",
          "slug": "await-all-promises",
          "children": []
        },
        {
          "level": 3,
          "title": "Wrap callback functions in a Promise",
          "slug": "wrap-callback-functions-in-a-promise",
          "children": []
        },
        {
          "level": 3,
          "title": "Other solutions",
          "slug": "other-solutions",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "False positives",
      "slug": "false-positives",
      "children": []
    }
  ],
  "git": {
    "updatedTime": 1643291954000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 1
      },
      {
        "name": "Dylan Pierce",
        "email": "me@dylanjpierce.com",
        "commits": 1
      }
    ]
  },
  "filePathRelative": "code/nodejs/async/README.md"
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
