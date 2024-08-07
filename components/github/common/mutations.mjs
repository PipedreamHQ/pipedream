const updateProjectItemMutation = `
  mutation moveItemToColumn($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
    updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: $value}) {
      projectV2Item {
        id
      }
    }
  }
`;

export default {
  updateProjectItemMutation,
};
