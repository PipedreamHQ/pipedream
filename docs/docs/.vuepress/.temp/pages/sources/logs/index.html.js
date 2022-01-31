export const data = {
  "key": "v-109810f0",
  "path": "/sources/logs/",
  "title": "Logs",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "SSE",
      "slug": "sse",
      "children": [
        {
          "level": 3,
          "title": "What is SSE?",
          "slug": "what-is-sse",
          "children": []
        },
        {
          "level": 3,
          "title": "Connecting to the SSE stream directly",
          "slug": "connecting-to-the-sse-stream-directly",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "pd logs",
      "slug": "pd-logs",
      "children": []
    },
    {
      "level": 2,
      "title": "Limits",
      "slug": "limits",
      "children": []
    }
  ],
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
  "filePathRelative": "sources/logs/README.md"
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
