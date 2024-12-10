export default {
  listEventTypes: `
    query Project($projectId: ID!) {
      project(id: $projectId) {
        eventTypes {
          totalCount
          nodes {
            id
            name
          }
        }
      }
    }
  `,
  listProjects: `
    query Session {
      session {
        projects {
          nodes {
            id
            name
          }
        }
      }
    }
  `,
  getProject: `
    query Project ($projectId: ID!) {
      project(id: $projectId) {
        categories {
          nodes {
            id
            name
          }
        }
        eventTypes {
          nodes {
            id
            name
          }
        }
        projectUsers {
          nodes {
            id
            email
          }
        }
        subscribers {
          nodes {
            id
            email
          }
        }
        templates {
          nodes {
            id
            name
          }
        }
        workItems {
          nodes {
            id
            name
          }
        }
      }
    }
  `,
  getWorkItem: `
    query WorkItem ($workItemId: ID!) {
      workItem(id: $workItemId) {
        subscribers {
          nodes {
            id
            email
          }
        }
      }
    }
  `,
  paginateAnnouncements: `
    query Project(
      $projectId: ID!
      $limit: Int!
      $cursor: String
      $rules: [Rule!]
    ) {
      project(id: $projectId) {
        announcements(
          orderBy: { field: "createdAt", sort: DESC }
          where: {
            rules: $rules
          }
          first: $limit
          after: $cursor
        ) {
          edges {
            cursor
            node {
              id
              name
              createdAt
              scheduledAt
              publishedAt
              state
              privatePermalink
              publicPermalink
              notificationsExcerptOnly
              inPublishedDigest
              headline
              hasPendingContentGenerators
              feedbackSadCount
              feedbackMehCount
              feedbackHappyCount
              excerptWithFallback
              excerpt
              doNotIndex
              description
              deactivatedAt
              contentType
              contentPlainText
              contentHtml
              content
              author
              archived
              authorWithFallback
              descriptionWithFallback
              scheduledAtTimezone
              shouldNotifyPageSubscribers
              slackChannelCount
              slackChannelCounts
              slackMessage
              slug
              subjectLine
              subjectLineWithFallback
              title
              titleWithFallback
              totalSubscriberCounts
              updatedAt
            }
          }
        }
      }
    }
  `,
  paginateSubscriptions: `
    query Project(
      $projectId: ID!
      $limit: Int!
      $cursor: String
      $rules: [Rule!]
    ) {
      project(id: $projectId) {
        subscriptions(
          orderBy: { field: "createdAt", sort: DESC }
          where: {
            rules: $rules
          }
          first: $limit
          after: $cursor
        ) {
          edges {
            cursor
            node {
              announcementPublished
              createdAt
              feedbackSubmitted
              id
              updatedAt
              eventTypes {
                createdAt
                id
                name
                updatedAt
              }
              categories {
                backgroundColor
                color
                createdAt
                description
                id
                name
                position
                slug
                textColor
                updatedAt
              }
            }
          }
        }
      }
    }
  `,
};
