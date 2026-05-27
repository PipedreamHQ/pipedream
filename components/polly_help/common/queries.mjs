export const SEARCH_QUERY = `
  query search(query: String!) {
    search(query: $query) {
      results {
        id
        name
        slug
        contentsnippet (length: 250)
      }
      searchinfo {
        nbHits
        query
        ms
      }
    }
  }
`;

export const GET_COLLECTION = `
  query getCollection($id: ID!) {
    collection(id: $id) {
      description
      articles {
        id
        name
        slug
      }
      collection_group_children {
        id
        name
      }
      collection_group_parent {
        id
        name
      }
    }
  }
`;

export const GET_ARTICLE = `
  query getArticle($id: ID!) {
    article(id: $id) {
      name
      slug
      custom_fields
      schema_elements {
        id
        name
        render_type
        order
        content    
      }
      date_modified
      attachments {
        type
        label
        action
        order
      }
      collections {
        id
      }
      relatedArticles(collectionId:"dbZdA2ofobRsrCKop") {
        id name
      }
    }
  }
`;
