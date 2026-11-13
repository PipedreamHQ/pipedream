const PROJECT_QUERY = `
  query($org: String!, $number: Int!, $field: String!) {
    organization(login: $org) {
      projectV2(number: $number) {
        id
        field(name: $field) {
          ... on ProjectV2SingleSelectField {
            id
            options { id name }
          }
        }
      }
    }
  }
`;

const PR_ITEMS_QUERY = `
  query($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        id
        projectItems(first: 50) {
          nodes {
            id
            project { id }
          }
        }
      }
    }
  }
`;

const ADD_ITEM_MUTATION = `
  mutation($projectId: ID!, $contentId: ID!) {
    addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
      item { id }
    }
  }
`;

const SET_STATUS_MUTATION = `
  mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { singleSelectOptionId: $optionId }
    }) {
      projectV2Item { id }
    }
  }
`;

async function getProject(gh, board) {
  const { organization } = await gh.graphql(PROJECT_QUERY, {
    org: board.org,
    number: board.projectNumber,
    field: board.statusField,
  });

  if (!organization?.projectV2) {
    throw new Error(`Project #${board.projectNumber} not found in ${board.org}`);
  }

  return organization.projectV2;
}

async function getOrAddItem(gh, project, { owner, repo, number }) {
  const { repository } = await gh.graphql(PR_ITEMS_QUERY, {
    owner,
    repo,
    number,
  });

  const { id: contentId, projectItems } = repository.pullRequest;
  const existing = projectItems.nodes.find((item) => item.project.id === project.id);

  if (existing) {
    return existing.id;
  }

  const { addProjectV2ItemById } = await gh.graphql(ADD_ITEM_MUTATION, {
    projectId: project.id,
    contentId,
  });

  return addProjectV2ItemById.item.id;
}

export async function setPrStatus(gh, board, pr, status) {
  const statusName = board.statuses[status];
  const project = await getProject(gh, board);

  const option = project.field?.options.find(
    (o) => o.name.toLowerCase() === statusName.toLowerCase(),
  );

  if (!option) {
    throw new Error(`Status "${statusName}" not found on field "${board.statusField}"`);
  }

  const itemId = await getOrAddItem(gh, project, pr);

  await gh.graphql(SET_STATUS_MUTATION, {
    projectId: project.id,
    itemId,
    fieldId: project.field.id,
    optionId: option.id,
  });
}
