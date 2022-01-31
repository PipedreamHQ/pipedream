export const data = {
  "key": "v-891efcb4",
  "path": "/api/rest/webhooks/",
  "title": "REST API Example: Webhooks",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Send events from an existing event source to a webhook",
      "slug": "send-events-from-an-existing-event-source-to-a-webhook",
      "children": [
        {
          "level": 3,
          "title": "Step 1 - retrieve the source's ID",
          "slug": "step-1-retrieve-the-source-s-id",
          "children": []
        },
        {
          "level": 3,
          "title": "Step 2 - Create a webhook",
          "slug": "step-2-create-a-webhook",
          "children": []
        },
        {
          "level": 3,
          "title": "Step 3 - Create a subscription",
          "slug": "step-3-create-a-subscription",
          "children": []
        },
        {
          "level": 3,
          "title": "Step 4 - Trigger an event",
          "slug": "step-4-trigger-an-event",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Extending these ideas",
      "slug": "extending-these-ideas",
      "children": []
    }
  ],
  "git": {
    "updatedTime": 1622852198000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 5
      }
    ]
  },
  "filePathRelative": "api/rest/webhooks/README.md"
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
