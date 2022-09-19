export default {
  createBoard: `
    mutation createBoard (
      $boardName: String!
      $boardKind: BoardKind!
      $folderId: Int
      $workspaceId: Int
      $templateId: Int
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
      $boardId: Int!
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
      $itemName: String
      $boardId: Int!
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
  createUpdate: `
    mutation createUpdate (
      $updateBody: String!
      $itemId: Int
      $parentId: Int
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
      $boardId: Int!
      $itemId: Int!
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
      $boardId: Int!
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
      $id: Int!
    ) {
      delete_webhook(
        id: $id
      ) {
        id
        board_id
      }
    }
  `,
};
