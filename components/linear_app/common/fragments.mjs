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
};
