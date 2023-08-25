import { gql } from "graphql-request";

const search = gql`
  query search(
    $after: String
    $first: Int
    $query: String
    $includeContent: Boolean
    $format: String
  ) {
    search(
      after: $after
      first: $first
      query: $query
      includeContent: $includeContent
      format: $format
    ) {
      ... on SearchSuccess {
        edges {
          cursor
          node {
            id
            title
            slug
            url
            createdAt
            updatedAt
            isArchived
            readingProgressTopPercent
            readingProgressPercent
            readingProgressAnchorIndex
            author
            image
            description
            publishedAt
            ownedByViewer
            originalArticleUrl
            uploadFileId
            pageId
            shortId
            quote
            annotation
            color
            subscription
            unsubMailTo
            unsubHttpUrl
            siteName
            language
            readAt
            savedAt
            siteIcon
            wordsCount
            content
            archivedAt
            #pageType: PageType!
            #contentReader
            #labels: [Label!]
            #state: ArticleSavingRequestStatus
            #recommendations: [Recommendation!]
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
          totalCount
        }
      }
      ... on SearchError {
        errorCodes
      }
    }
  }
`;

export default {
  queries: {
    search,
  },
};
