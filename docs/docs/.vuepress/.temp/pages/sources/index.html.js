export const data = {
  "key": "v-3ebfc570",
  "path": "/sources/",
  "title": "Sources",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Overview",
      "slug": "overview",
      "children": []
    },
    {
      "level": 2,
      "title": "Creating event sources",
      "slug": "creating-event-sources",
      "children": [
        {
          "level": 3,
          "title": "Creating a source from the UI",
          "slug": "creating-a-source-from-the-ui",
          "children": []
        },
        {
          "level": 3,
          "title": "Creating a source from the CLI",
          "slug": "creating-a-source-from-the-cli",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Consuming events from sources",
      "slug": "consuming-events-from-sources",
      "children": []
    },
    {
      "level": 2,
      "title": "Example: HTTP source",
      "slug": "example-http-source",
      "children": []
    },
    {
      "level": 2,
      "title": "Example: Cron jobs",
      "slug": "example-cron-jobs",
      "children": []
    },
    {
      "level": 2,
      "title": "Example: RSS",
      "slug": "example-rss",
      "children": []
    },
    {
      "level": 2,
      "title": "Publishing a new event source, or modifying an existing source",
      "slug": "publishing-a-new-event-source-or-modifying-an-existing-source",
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
  "filePathRelative": "sources/README.md"
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
