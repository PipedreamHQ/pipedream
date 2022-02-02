export const themeData = {
  "algolia": {
    "apiKey": "1e23962724b59d018bdedc0f5a214ce5",
    "indexName": "pipedream-v2"
  },
  "searchPlaceholder": "Search...",
  "logo": "/pipedream.svg",
  "repo": "PipedreamHQ/pipedream",
  "navbar": [
    {
      "text": "Get Started",
      "link": "/quickstart/README.md"
    },
    {
      "text": "Concepts",
      "grid": [
        {
          "title": "Workflows",
          "subtitle": "Automate series of actions",
          "link": "/workflows/",
          "icon": "workflow-icon"
        },
        {
          "title": "Steps",
          "subtitle": "Perform pre-coded actions",
          "link": "/workflows/steps",
          "icon": "step-icon"
        },
        {
          "title": "Triggers",
          "subtitle": "Control when workflows run",
          "link": "/workflows/triggers",
          "icon": "trigger-icon"
        },
        {
          "title": "Code",
          "subtitle": "Run code in workflow steps",
          "link": "/code/",
          "icon": "code-icon"
        },
        {
          "title": "Integrate",
          "subtitle": "Connect apps together",
          "link": "/apps/",
          "icon": "integration-icon"
        }
      ]
    }
  ],
  "nav": [
    {
      "text": "v2",
      "className": "docs-version",
      "ariaLabel": "Docs Version Menu",
      "items": [
        {
          "text": "v2",
          "link": "https://pipedream.com/docs-v2",
          "internal": true,
          "badge": "New",
          "badgeVariation": "primary"
        },
        {
          "text": "v1",
          "internal": true,
          "link": "https://pipedream.com/docs"
        }
      ]
    }
  ],
  "docsDir": "docs/docs",
  "editLinks": true,
  "editLinkText": "Help us improve this page! Submit an edit on Github",
  "sidebar": {
    "/quickstart/": [
      {
        "text": "Get Started",
        "children": [
          "/quickstart/hello-world/README.md"
        ]
      }
    ]
  },
  "bundler": "@vuepress/vite",
  "bundlerConfig": {
    "viteOptions": {
      "css": {
        "postcss": {
          "plugins": [
            null,
            null
          ]
        }
      }
    }
  },
  "PIPEDREAM_BASE_URL": "https://pipedream.com",
  "API_BASE_URL": "https://api.pipedream.com/v1",
  "SQL_API_BASE_URL": "https://rt.pipedream.com/sql",
  "PAYLOAD_SIZE_LIMIT": "512KB",
  "MEMORY_LIMIT": "256MB",
  "MEMORY_ABSOLUTE_LIMIT": "10GB",
  "EMAIL_PAYLOAD_SIZE_LIMIT": "30MB",
  "INSPECTOR_EVENT_LIMIT": "100",
  "FUNCTION_PAYLOAD_LIMIT": "6MB",
  "INSPECTOR_EVENT_EXPIRY_DAYS": "30",
  "DAILY_INVOCATIONS_LIMIT": "333",
  "FREE_ORG_DAILY_INVOCATIONS_LIMIT": "66",
  "PRICE_PER_INVOCATION": "0.0002",
  "FREE_MONTHLY_INVOCATIONS": "10,000",
  "PRO_MONTHLY_INVOCATIONS": "20,000",
  "TEAM_MONTHLY_INVOCATIONS": "20,000",
  "ENTERPRISE_MONTHLY_INVOCATIONS": "100,000",
  "TEAM_MEMBER_LIMIT": "5",
  "PRO_MONTHLY_PRICE": "$19",
  "TEAM_MONTHLY_PRICE": "$19",
  "DEFAULT_WORKFLOW_QUEUE_SIZE": "100",
  "MAX_WORKFLOW_QUEUE_SIZE": "10,000",
  "NODE_VERSION": "14",
  "PYTHON_VERSION": "3.8",
  "CONFIGURED_PROPS_SIZE_LIMIT": "64KB",
  "SERVICE_DB_SIZE_LIMIT": "60KB",
  "TMP_SIZE_LIMIT": "512MB",
  "locales": {
    "/": {
      "selectLanguageName": "English"
    }
  },
  "darkMode": true,
  "selectLanguageText": "Languages",
  "selectLanguageAriaLabel": "Select language",
  "sidebarDepth": 2,
  "editLink": true,
  "lastUpdated": true,
  "lastUpdatedText": "Last Updated",
  "contributors": true,
  "contributorsText": "Contributors",
  "notFound": [
    "There's nothing here.",
    "How did we get here?",
    "That's a Four-Oh-Four.",
    "Looks like we've got some broken links."
  ],
  "backToHome": "Take me home",
  "openInNewWindow": "open in new window",
  "toggleDarkMode": "toggle dark mode",
  "toggleSidebar": "toggle sidebar"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
