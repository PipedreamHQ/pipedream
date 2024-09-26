import { gql } from "graphql-request";

const listArticles = gql`
  query listArticles(
    $sharedOnly: Boolean,
    $sort: SortParams,
    $after: String,
    $first: Int,
    $query: String,
    $includePending: Boolean
  ) {
    articles(
      sharedOnly: $sharedOnly,
      sort: $sort,
      after: $after,
      first: $first,
      query: $query,
      includePending: $includePending
    ) {
      ... on ArticlesSuccess {
        edges {
          cursor
          node {
            id
            title
            slug
            url
            hash
            #content
            #pageType: PageType
            #hasContent
            #author
            #image
            #description
            #originalHtml
            #createdAt
            #savedAt
            #updatedAt
            #publishedAt
            #readingProgressTopPercent
            #readingProgressPercent
            #readingProgressAnchorIndex
            #sharedComment
            #savedByViewer
            #postedByViewer
            #originalArticleUrl
            #isArchived
            #linkId
            #uploadFileId
            #siteName
            #siteIcon
            #subscription
            #unsubMailTo
            #unsubHttpUrl
            #wordsCount
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
      ... on ArticlesError {
        errorCodes
      }
    }
  }
`;

const getArticle = gql`
  query getArticle(
    $username: String!,
    $slug: String!,
    $format: String
  ) {
    article(
      username: $username,
      slug: $slug,
      format: $format
    ) {
      ... on ArticleSuccess {
        article {
          id
          title
          slug
          url
          hash
          content
        }
      }
      ... on ArticleError {
        errorCodes
      }
    }
  }
`;

export default {
  queries: {
    listArticles,
    getArticle,
  },
};
