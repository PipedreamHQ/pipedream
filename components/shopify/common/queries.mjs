const GET_BLOG = `
  query BlogShow($id: ID!, $first: Int, $after: String, $reverse: Boolean) {
    blog(id: $id) {
      articles(first: $first, after: $after, reverse: $reverse) {
        nodes {
          id
          title
          author {
            name
          }
          blog {
            id
          }
          body
          createdAt
          updatedAt
          isPublished
          publishedAt
          summary
          tags
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const LIST_BLOGS = `
  query BlogList($first: Int, $after: String) {
    blogs(first: $first, after: $after) {
      nodes {
        id
        title
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_PAGES = `
  query PageList($first: Int, $after: String, $reverse: Boolean) {
    pages(first: $first, after: $after, reverse: $reverse) {
      nodes {
        id
        title
        body
        bodySummary
        createdAt
        handle
        isPublished
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
          }
        }
        publishedAt
        updatedAt
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_PRODUCTS = `
  query ($first: Int, $after: String, $reverse: Boolean, $sortKey: ProductSortKeys) {
    products (first: $first, after: $after, reverse: $reverse, sortKey: $sortKey) {
      nodes {
        id
        title
        category {
          id
        }
        collections (first: $first) {
          nodes {
            id
            title
          }
        }
        createdAt
        description
        handle
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
          }
        }
        onlineStoreUrl
        productType
        publishedAt
        status
        tags
        totalInventory
        updatedAt
        variants (first: $first) {
          nodes {
            id
            title
          }
        }
        vendor
      } pageInfo {
        endCursor
      }
    }
  }
`;

export default {
  GET_BLOG,
  LIST_BLOGS,
  LIST_PAGES,
  LIST_PRODUCTS,
};
