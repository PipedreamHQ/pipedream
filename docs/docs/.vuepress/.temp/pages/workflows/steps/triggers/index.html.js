export const data = {
  "key": "v-15a576d0",
  "path": "/workflows/steps/triggers/",
  "title": "Triggers",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "App-based Triggers",
      "slug": "app-based-triggers",
      "children": [
        {
          "level": 3,
          "title": "What's the difference between an event source and a trigger?",
          "slug": "what-s-the-difference-between-an-event-source-and-a-trigger",
          "children": []
        },
        {
          "level": 3,
          "title": "Dependent and Independent Sources",
          "slug": "dependent-and-independent-sources",
          "children": []
        },
        {
          "level": 3,
          "title": "Shape of the steps.trigger.event object",
          "slug": "shape-of-the-steps-trigger-event-object",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "HTTP",
      "slug": "http",
      "children": [
        {
          "level": 3,
          "title": "Accessing HTTP request data",
          "slug": "accessing-http-request-data",
          "children": []
        },
        {
          "level": 3,
          "title": "Valid Requests",
          "slug": "valid-requests",
          "children": []
        },
        {
          "level": 3,
          "title": "How Pipedream handles JSON payloads",
          "slug": "how-pipedream-handles-json-payloads",
          "children": []
        },
        {
          "level": 3,
          "title": "How Pipedream handles multipart/form-data",
          "slug": "how-pipedream-handles-multipart-form-data",
          "children": []
        },
        {
          "level": 3,
          "title": "Sending large payloads",
          "slug": "sending-large-payloads",
          "children": []
        },
        {
          "level": 3,
          "title": "Large File Support",
          "slug": "large-file-support",
          "children": []
        },
        {
          "level": 3,
          "title": "Cross-Origin HTTP Requests",
          "slug": "cross-origin-http-requests",
          "children": []
        },
        {
          "level": 3,
          "title": "HTTP Responses",
          "slug": "http-responses",
          "children": []
        },
        {
          "level": 3,
          "title": "Errors",
          "slug": "errors",
          "children": []
        },
        {
          "level": 3,
          "title": "Validating requests",
          "slug": "validating-requests",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Schedule",
      "slug": "schedule",
      "children": [
        {
          "level": 3,
          "title": "Choosing a cron trigger",
          "slug": "choosing-a-cron-trigger",
          "children": []
        },
        {
          "level": 3,
          "title": "Testing a cron job",
          "slug": "testing-a-cron-job",
          "children": []
        },
        {
          "level": 3,
          "title": "Future executions of your cron job",
          "slug": "future-executions-of-your-cron-job",
          "children": []
        },
        {
          "level": 3,
          "title": "Job History",
          "slug": "job-history",
          "children": []
        },
        {
          "level": 3,
          "title": "Trigger a notification to an external service (email, Slack, etc.)",
          "slug": "trigger-a-notification-to-an-external-service-email-slack-etc",
          "children": []
        },
        {
          "level": 3,
          "title": "Rate Limit",
          "slug": "rate-limit",
          "children": []
        },
        {
          "level": 3,
          "title": "Troubleshooting your scheduled jobs",
          "slug": "troubleshooting-your-scheduled-jobs",
          "children": []
        },
        {
          "level": 3,
          "title": "Limitations",
          "slug": "limitations",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Email",
      "slug": "email",
      "children": [
        {
          "level": 3,
          "title": "Sending large emails",
          "slug": "sending-large-emails",
          "children": []
        },
        {
          "level": 3,
          "title": "Appending metadata to the incoming email address with +data",
          "slug": "appending-metadata-to-the-incoming-email-address-with-data",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "RSS",
      "slug": "rss",
      "children": []
    },
    {
      "level": 2,
      "title": "SDK",
      "slug": "sdk",
      "children": []
    },
    {
      "level": 2,
      "title": "Don't see a trigger you need?",
      "slug": "don-t-see-a-trigger-you-need",
      "children": []
    },
    {
      "level": 2,
      "title": "Multiple triggers for one workflow",
      "slug": "multiple-triggers-for-one-workflow",
      "children": []
    }
  ],
  "git": {
    "updatedTime": 1643215865000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 18
      },
      {
        "name": "Dylan Pierce",
        "email": "me@dylanjpierce.com",
        "commits": 5
      },
      {
        "name": "Danny Roosevelt",
        "email": "danny@pipedream.com",
        "commits": 1
      },
      {
        "name": "Pravin",
        "email": "pravin@pipedream.com",
        "commits": 1
      }
    ]
  },
  "filePathRelative": "workflows/steps/triggers/README.md"
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
