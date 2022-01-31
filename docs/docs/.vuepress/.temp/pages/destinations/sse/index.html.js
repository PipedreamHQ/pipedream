export const data = {
  "key": "v-6b60629b",
  "path": "/destinations/sse/",
  "title": "Server-Sent Events (SSE)",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "What is SSE?",
      "slug": "what-is-sse",
      "children": []
    },
    {
      "level": 2,
      "title": "What can I do with the SSE destination?",
      "slug": "what-can-i-do-with-the-sse-destination",
      "children": []
    },
    {
      "level": 2,
      "title": "Sending data to an SSE Destination in workflows",
      "slug": "sending-data-to-an-sse-destination-in-workflows",
      "children": []
    },
    {
      "level": 2,
      "title": "Using $.send.sse in component actions",
      "slug": "using-send-sse-in-component-actions",
      "children": []
    },
    {
      "level": 2,
      "title": "Receiving events",
      "slug": "receiving-events",
      "children": [
        {
          "level": 3,
          "title": "Retrieving your workflow's event stream URL",
          "slug": "retrieving-your-workflow-s-event-stream-url",
          "children": []
        },
        {
          "level": 3,
          "title": "Sample code to connect to your event stream",
          "slug": "sample-code-to-connect-to-your-event-stream",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": ":keepalive messages",
      "slug": "keepalive-messages",
      "children": []
    }
  ],
  "git": {
    "updatedTime": 1643041052000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 4
      },
      {
        "name": "Dylan Pierce",
        "email": "me@dylanjpierce.com",
        "commits": 2
      }
    ]
  },
  "filePathRelative": "destinations/sse/README.md"
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
