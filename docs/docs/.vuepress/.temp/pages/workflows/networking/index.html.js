export const data = {
  "key": "v-2cfd0967",
  "path": "/workflows/networking/",
  "title": "Network / IP range",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "HTTP requests",
      "slug": "http-requests",
      "children": []
    },
    {
      "level": 2,
      "title": "Non-HTTP traffic (databases, etc.)",
      "slug": "non-http-traffic-databases-etc",
      "children": []
    },
    {
      "level": 2,
      "title": "Feature request for Pipedream restricting its IP range",
      "slug": "feature-request-for-pipedream-restricting-its-ip-range",
      "children": []
    }
  ],
  "git": {
    "updatedTime": 1630516905000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 2
      }
    ]
  },
  "filePathRelative": "workflows/networking/README.md"
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
