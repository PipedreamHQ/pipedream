export default {
  pageInfo: `
    fragment PageInfo on PageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
  `,
  issue: `
    fragment Issue on Issue {
      trashed
      labelIds
      url
      identifier
      priorityLabel
      previousIdentifiers
      customerTicketCount
      branchName
      botActor {
        avatarUrl
        name
        userDisplayName
        subType
        type
        id
      }
      cycle {
        id
      }
      dueDate
      estimate
      description
      title
      number
      lastAppliedTemplate {
        id
      }
      updatedAt
      sortOrder
      subIssueSortOrder
      parent {
        id
      }
      priority
      project {
        id
      }
      projectMilestone {
        id
      }
      team {
        id
      }
      archivedAt
      createdAt
      startedTriageAt
      triagedAt
      autoArchivedAt
      autoClosedAt
      canceledAt
      completedAt
      startedAt
      snoozedUntilAt
      id
      assignee {
        id
      }
      creator {
        id
      }
      snoozedBy {
        id
      }
      favorite {
        id
      }
      state {
        id
      }
    }
  `,
  comment: `
    fragment Comment on Comment {
      id
      body
      createdAt
      reactionData
      updatedAt
      issue {
        id
        title
        project {
          id
          name
        }
      }
      user {
        id
        name
      }
    }
  `,
  project: `
    fragment Project on Project {
      id
      name
      creator {
        id
      }
      lead {
        id
      }
      status {
        id
      }
      color
      completedIssueCountHistory
      completedScopeHistory
      createdAt
      description
      inProgressScopeHistory
      issueCountHistory
      name
      priority
      progress
      scope
      scopeHistory
      slackIssueComments
      slackIssueStatuses
      slackNewIssue
      slugId
      sortOrder
      state
      updatedAt
      url
    }
  `,
  projectUpdate: `
    fragment ProjectUpdate on ProjectUpdate {
      id
      body
      health
      project {
        id
        name
        lead {
          id
          name
        }
        initiatives {
          nodes {
            name
          }
        }
      }
      user {
        id
      }
      createdAt
      updatedAt
      bodyData
      slugId
      infoSnapshot
      url
    }
  `,
};
