export const data = {
  "key": "v-5fe8cc3d",
  "path": "/removed-features/dollar-variables/",
  "title": "Changing how we reference $event and $context",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "$event is now event",
      "slug": "event-is-now-event",
      "children": []
    },
    {
      "level": 2,
      "title": "$context is now steps.trigger.context",
      "slug": "context-is-now-steps-trigger-context",
      "children": []
    }
  ],
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
  "filePathRelative": "removed-features/dollar-variables/README.md"
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
