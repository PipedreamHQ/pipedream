export const queries = {
  events: `
    query Events ($page: Int!, $pageSize: Int!){
      events(page: $page, pageSize: $pageSize) {
        id
        title
      }
    }
  `,
  eventPerson: `
    query EventPerson(
      $eventId: ID!,
      $filters: [EventPersonFilter!],
      $sort: [EventPersonSort!],
      $cursor: CursorPaginationInput
    ) {
      eventPerson(
        eventId: $eventId,
        filters: $filters,
        sort: $sort,
        cursor: $cursor
      ) {
        nodes {
          id
          userId
          email
          firstName
          lastName
          jobTitle
          secondJobTitle
          photoUrl
          organization
          websiteUrl
          biography
          tags
          isVisible
          source
          createdAt
          updatedAt
          communityProfileUpdatedAt
          type
          engagementScore
          clientIds
          registration {
            id
            paymentStatus
            status
            confirmationCode
            registeredAt
            canceledAt
            checkIn
            checkInSource
          }
        }
        pageInfo {
          hasPrevPage
          currentPage
          lastPage
          totalItems
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `,
};
