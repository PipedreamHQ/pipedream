export default {
  createBoard: `
    mutation createBoard (
      $boardName: String!
      $boardKind: BoardKind!
      $folderId: ID
      $workspaceId: ID
      $templateId: ID
    ) {
      create_board (
        board_name: $boardName
        board_kind: $boardKind
        folder_id: $folderId
        workspace_id: $workspaceId
        template_id: $templateId
      ) {
        id
      }
    }
  `,
  createGroup: `
    mutation createGroup (
      $boardId: ID!
      $groupName: String!
    ) {
      create_group (
        board_id: $boardId
        group_name: $groupName
      ) {
        id
      }
    }
  `,
  createItem: `
    mutation createItem (
      $itemName: String!
      $boardId: ID!
      $groupId: String
      $columnValues: JSON
      $createLabels: Boolean
    ) {
      create_item (
        item_name: $itemName
        board_id: $boardId
        group_id: $groupId
        column_values: $columnValues
        create_labels_if_missing: $createLabels
      ) {
        id
      }
    }
  `,
  createSubItem: `
    mutation createSubItem (
      $itemName: String!
      $parentItemId: ID!
      $columnValues: JSON
      $createLabels: Boolean
    ) {
      create_subitem (
        item_name: $itemName
        parent_item_id: $parentItemId
        column_values: $columnValues
        create_labels_if_missing: $createLabels
      ) {
        id
      }
    }
  `,
  createUpdate: `
    mutation createUpdate (
      $updateBody: String!
      $itemId: ID
      $parentId: ID
    ) {
      create_update (
        body: $updateBody
        item_id: $itemId
        parent_id: $parentId
      ) {
        id
      }
    }
  `,
  updateItemName: `
    mutation updateItemName (
      $boardId: ID!
      $itemId: ID!
      $columnValues: JSON!
    ) {
      change_multiple_column_values (
        board_id: $boardId
        item_id: $itemId
        column_values: $columnValues
      ) {
        id
      }
    }
  `,
  createWebhook: `
    mutation createWebhook (
      $boardId: ID!
      $url: String!
      $event: WebhookEventType!
      $config: JSON
    ) {
      create_webhook(
        board_id: $boardId
        url: $url
        event: $event
        config: $config
      ) {
        id
        board_id
      }
    }
  `,
  deleteWebhook: `
    mutation deleteWebhook (
      $id: ID!
    ) {
      delete_webhook(
        id: $id
      ) {
        id
        board_id
      }
    }
  `,
  createColumn: `
    mutation createColumn (
      $boardId: ID!
      $title: String!
      $columnType: ColumnType!
      $defaults: JSON
      $description: String
    ) {
      create_column(
        board_id: $boardId
        title: $title
        column_type: $columnType
        defaults: $defaults
        description: $description
      ) {
        id
      }
    }
  `,
  updateColumnValues: `
    mutation updateItem (
      $boardId: ID!
      $itemId: ID!
      $columnValues: JSON!
    ) {
      change_multiple_column_values (
        board_id: $boardId
        item_id: $itemId
        column_values: $columnValues
      ) {
        id
        name
        column_values {
          id
          value
          text
        }
      }
    }
  `,
};
