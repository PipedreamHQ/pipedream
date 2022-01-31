export const data = {
  "key": "v-11ddf10b",
  "path": "/errors/",
  "title": "Common Errors",
  "lang": "en-US",
  "frontmatter": {
    "prev": false
  },
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Warnings",
      "slug": "warnings",
      "children": [
        {
          "level": 3,
          "title": "This step was still trying to run code when the step ended. Make sure you await all Promises, or promisify callback functions.",
          "slug": "this-step-was-still-trying-to-run-code-when-the-step-ended-make-sure-you-await-all-promises-or-promisify-callback-functions",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Pipedream Internal Errors",
      "slug": "pipedream-internal-errors",
      "children": [
        {
          "level": 3,
          "title": "Invocations Quota Exceeded",
          "slug": "invocations-quota-exceeded",
          "children": []
        },
        {
          "level": 3,
          "title": "Runtime Quota Exceeded",
          "slug": "runtime-quota-exceeded",
          "children": []
        },
        {
          "level": 3,
          "title": "Timeout",
          "slug": "timeout",
          "children": []
        },
        {
          "level": 3,
          "title": "Out of Memory",
          "slug": "out-of-memory",
          "children": []
        },
        {
          "level": 3,
          "title": "Rate Limit Exceeded",
          "slug": "rate-limit-exceeded",
          "children": []
        },
        {
          "level": 3,
          "title": "Request Entity Too Large",
          "slug": "request-entity-too-large",
          "children": []
        },
        {
          "level": 3,
          "title": "Function Payload Limit Exceeded",
          "slug": "function-payload-limit-exceeded",
          "children": []
        },
        {
          "level": 3,
          "title": "JSON Nested Property Limit Exceeded",
          "slug": "json-nested-property-limit-exceeded",
          "children": []
        },
        {
          "level": 3,
          "title": "Event Queue Full",
          "slug": "event-queue-full",
          "children": []
        }
      ]
    }
  ],
  "git": {
    "updatedTime": 1632789002000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 13
      },
      {
        "name": "Pravin",
        "email": "psavkar@yahoo.com",
        "commits": 1
      }
    ]
  },
  "filePathRelative": "errors/README.md"
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
