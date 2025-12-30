const listLabels = `
  query listLabels($projectId: ID!) {
    project(project_id: $projectId) {
      labels {
        id
        name
      }
    }
  }`;

const listLocales = `
  query listLocales {
    locales {
      id
      name
    }
  }
`;

const listPosts = `
  query listPosts($projectId: ID!, $page: Int!) {
  posts(project_id: $projectId, page: $page, orderField: "created_at") {
    count
    page
    pages
    list {
      id
      project_id
      user_id
      created_at
      visible_at
      image_id
      expire_at
      updated_at
      is_draft
      is_pushed
      is_pinned
      is_internal
      is_feedback_disabled
      external_url
      segment_filters
      flags
      view_data
      status
      is_paused
      contents {
        post_id
        locale_id
        title
        body
        summary
        slug
        url
        name
      }
    }
  }
}`;

const listActivities = `
  query ProjectActivities($projectId: ID!, $page: Int, $type: [String!]) {
  activities(
    project_id: $projectId
    page: $page
    type: $type
  ) {
    page
    pages
    count
    items {
      ...activity
      __typename
    }
    __typename
  }
}

fragment activity on Activity {
  id
  type
  url
  created_at
  post {
    id
    defaultContent {
      title
      __typename
    }
    __typename
  }
  feature_request {
    id
    defaultContent {
      title
      __typename
    }
    __typename
  }
  feedback {
    ...feedback
    __typename
  }
  __typename
}

fragment feedback on Feedback {
  id
  post {
    id
    defaultContent {
      title
      name
      __typename
    }
    __typename
  }
  feature_request {
    id
    defaultContent {
      title
      __typename
    }
    __typename
  }
  reaction
  feedback
  source
  score
  created_at
  __typename
}`;

const createPost = `
  mutation CreatePost($projectId: ID!, $contents:[PostContentInput!]!, $isDraft: Boolean, $labels: [ID!]) {
    savePost(project_id: $projectId, contents: $contents, is_draft: $isDraft, labels: $labels) {
      id
      project_id
      user_id
      created_at
      visible_at
      image_id
      expire_at
      updated_at
      is_draft
      is_pushed
      is_pinned
      is_internal
      is_feedback_disabled
      external_url
      segment_filters
      flags
      view_data
      status
      is_paused
      contents {
        post_id
        locale_id
        title
        body
        summary
        slug
        url
        name
      }
    }
  }
`;

export default {
  listLabels,
  listLocales,
  listPosts,
  listActivities,
  createPost,
};
