const LIST_ABANDONED_CHECKOUTS = `
  query AbandonedCheckouts($first: Int, $after: String) {
    abandonedCheckouts(first: $first, after: $after) {
      nodes {
        abandonedCheckoutUrl
        billingAddress {
          country
        }
        completedAt
        createdAt
        customer {
          firstName
          lastName
          email
        }
        id
        shippingAddress {
          country
        }
        updatedAt
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_BLOG_ARTICLES = `
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
          metafields (first: $first) {
            nodes {
              id
              key
              namespace
              value
              type
            }
          }
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
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
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
            type
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
  query ($first: Int, $after: String, $reverse: Boolean, $sortKey: ProductSortKeys, $query: String) {
    products (first: $first, after: $after, reverse: $reverse, sortKey: $sortKey, query: $query) {
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
            type
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
        options (first: $first) {
          id
          name
        }
      } 
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_COLLECTIONS = `
  query CustomCollectionList($first: Int, $after: String, $reverse: Boolean, $query: String) {
    collections(first: $first, after: $after, reverse: $reverse, query: $query) {
      nodes {
        id
        title
        description
        descriptionHtml
        handle
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
        products (first: $first) {
          nodes {
            id
            title
          }
        }
        productsCount {
          count
        }
        seo {
          title
          description
        }
        updatedAt
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_PRODUCT_VARIANTS = `
  query ($first: Int, $after: String, $query: String) {
    productVariants (first: $first, after: $after, query: $query) {
      nodes {
        id
        title
        inventoryItem {
          id
        }
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_METAOBJECTS = `
  query ($type: String!, $first: Int, $after: String) {
    metaobjects(type: $type, first: $first, after: $after) {
      nodes {
        id
        handle
        type
        displayName
        updatedAt
        fields {
          key
          type
          value
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_METAOBJECT_DEFINITIONS = `
  query ($first: Int, $after: String) {
    metaobjectDefinitions(first: $first, after: $after) {
      nodes {
        id
        name
        type
        fieldDefinitions {
          key
          type {
            name
          }
          name
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_LOCATIONS = `
  query ($first: Int, $after: String) {
    locations(first: $first, after: $after) {
      nodes {
        id
        name
        address {
          formatted
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const GET_PRODUCT = `
  query ($id: ID!, $first: Int, $after: String) {
    product (id: $id) {
      id
      title
      media (first: $first, after: $after) {
        nodes {
          id
        }
        pageInfo {
          endCursor
        }
      }
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
      options (first: $first) {
        id
        name
        optionValues {
          id
          name
        }
      }
    },
  }
`;

const GET_PRODUCT_VARIANT = `
  query ($id: ID!, $first: Int, $after: String) {
    productVariant (id: $id) {
      id
      title
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_COLLECTION = `
  query ($id: ID!, $first: Int, $after: String) {
    collection(id: $id) {
      id
      title
      handle
      updatedAt
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_BLOG = `
  query BlogShow($id: ID!, $first: Int, $after: String) {
    blog(id: $id) {
      id
      title
      handle
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_PAGE = `
  query PageShow($id: ID!, $first: Int, $after: String) {
    page(id: $id) {
      id
      title
      handle
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_ARTICLE = `
  query ArticleShow($id: ID!, $first: Int, $after: String) {
    article(id: $id) {
      id
      author {
        name
      }
      createdAt
      handle
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_METAOBJECT = `
  query ($id: ID!) {
    metaobject(id: $id) {
      id
      handle
      type
      displayName
      updatedAt
      fields {
        key
        type
        value
        definition {
          name
        }
      }
    }
  }
`;

export default {
  LIST_ABANDONED_CHECKOUTS,
  LIST_BLOG_ARTICLES,
  LIST_BLOGS,
  LIST_PAGES,
  LIST_PRODUCTS,
  LIST_COLLECTIONS,
  LIST_PRODUCT_VARIANTS,
  LIST_METAOBJECTS,
  LIST_METAOBJECT_DEFINITIONS,
  LIST_LOCATIONS,
  GET_PRODUCT,
  GET_PRODUCT_VARIANT,
  GET_COLLECTION,
  GET_BLOG,
  GET_PAGE,
  GET_ARTICLE,
  GET_METAOBJECT,
};
