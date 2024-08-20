const updateProjectItemMutation = `
  mutation moveItemToColumn($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
    updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: $value}) {
      projectV2Item {
        id
      }
    }
  }
`;

const updateProjectItemPositionMutation = `
  mutation moveProjectV2Item($projectId: ID!, $itemId: ID!, $afterId: ID) {
    updateProjectV2ItemPosition(input: { projectId: $projectId, itemId: $itemId, afterId: $afterId }) {
      clientMutationId
    }
  }
`;

export default {
  updateProjectItemMutation,
  updateProjectItemPositionMutation,
};
