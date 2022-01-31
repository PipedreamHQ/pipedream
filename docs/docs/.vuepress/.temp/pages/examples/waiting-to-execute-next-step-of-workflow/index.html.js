export const data = {
  "key": "v-b8c0ce84",
  "path": "/examples/waiting-to-execute-next-step-of-workflow/",
  "title": "Example: Delay a workflow before the next step runs",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Step 1 - Create a Task Scheduler event source",
      "slug": "step-1-create-a-task-scheduler-event-source",
      "children": []
    },
    {
      "level": 2,
      "title": "Step 2 - Review your workflow / delay logic",
      "slug": "step-2-review-your-workflow-delay-logic",
      "children": []
    },
    {
      "level": 2,
      "title": "Step 3 - Add the delay step to Workflow #1",
      "slug": "step-3-add-the-delay-step-to-workflow-1",
      "children": []
    },
    {
      "level": 2,
      "title": "Step 4 - Move the steps you'd like to delay to Workflow #2",
      "slug": "step-4-move-the-steps-you-d-like-to-delay-to-workflow-2",
      "children": []
    }
  ],
  "git": {
    "updatedTime": 1622855149000,
    "contributors": [
      {
        "name": "Dylan J. Sather",
        "email": "dylan.sather@gmail.com",
        "commits": 3
      }
    ]
  },
  "filePathRelative": "examples/waiting-to-execute-next-step-of-workflow/README.md"
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
