export default {
  listBoards: `
    query listBoards (
      $page: Int = 1
    ) {
      boards(
        page: $page
        state: all
        order_by: created_at
      ) {
        id
        name
        type
      }
    }
  `,
  listWorkspaces: `
    query { 
      workspaces {
        id
        name
      }
    }
  `,
  listFolders: `
    query ($workspaceId: [ID]) { 
      folders (workspace_ids: $workspaceId) {
        id
        name
      }
    }
  `,
  listWorkspacesBoards: `
    query {
      boards (
        limit: 200
        state: all
        order_by: created_at
      ) {
        workspace {
          id
          name
        }
      }
    }
  `,
  listGroupsBoards: `
    query listGroups ($boardId: ID!) {
      boards (ids: [$boardId]) {
        groups {
          id
          title
        }
      }
    }
  `,
  listItemsBoard: `
    query listItems ($boardId: ID!) {
      boards (ids: [$boardId]) {
        items_page (query_params: {order_by:[{ column_id: "__creation_log__", direction: desc }]}) {
          cursor
          items {
            id
            name
          }
        }
      }
    }
  `,
  listItemsNextPage: `
    query listItems ($cursor: String!) {
      next_items_page (cursor: $cursor) {
        cursor
        items {
          id
          name
        }
      }
    }
  `,
  listUpdatesBoard: `
    query listUpdates (
      $boardId: ID!,
      $page: Int = 1
    ) {
      boards (ids: [$boardId]) {
        updates (
          page: $page
        ) {
          id
          body
        }
      }
    }
  `,
  listColumns: `
    query listColumns ($boardId: ID!) {
      boards (ids: [$boardId]) {
        columns {
          id
          settings_str
          title
          type
        }
      }
    }
  `,
  listBoardItemsPage: `
    query listBoardItemsPage ($boardId: ID!, $cursor: String) {
      boards (ids: [$boardId]){
        items_page (cursor: $cursor) {
          cursor
          items {
            id 
            name 
          }
        }
      }
    }
  `,
  listColumnOptions: `
    query listColumnOptions ($boardId: ID!) {
      boards (ids: [$boardId]) {
        columns {
          id
          title
        }
      }
    }
  `,
  listUsers: `
    query {
      users (
        newest_first: true
      ) {
        id
        name
        created_at
      }
    }
  `,
  getItem: `
    query getItem ($id: ID!) {
      items (ids: [$id]) {
        id
        name
        board {
          id
        }
        group {
          id
        }
        created_at
        creator_id
        updated_at
        parent_item {
          id
        }
        column_values {
          id
          value
        }
        email
      }
    }
  `,
  getBoard: `
    query getBoard($id: ID!) {
      boards (ids: [$id]) {
        id
        name
        board_folder_id
        columns {
          id
        }
        description
        groups {
          id
        }
        items_page {
          items {
            id
          }
        }
        owner {
          id
        }
        permissions
        tags {
          id
        }
        type
        updated_at
        workspace_id
      }
    }
  `,
  getUser: `
    query getUser($id: ID!) {
      users (ids: [$id]) {
        id
        name
        account {
          id
        }
        birthday
        country_code
        created_at
        join_date
        email
        is_admin
        is_guest
        is_pending
        is_view_only
        is_verified
        location
        mobile_phone
        phone
        photo_original
        photo_small
        photo_thumb
        photo_thumb_small
        photo_tiny
        teams {
          id
        }
        time_zone_identifier
        title
        url
        utc_hours_diff
        current_language
      }
    }
  `,
  getColumnValues: `
    query getItem ($itemId: ID!, $columnIds: [String!]) {
      items (ids: [$itemId]){
        id
        name
        column_values (ids: $columnIds){
          id
          value
          text
        }
      }
    }
  `,
  getItemsByColumnValue: `
    query ($boardId: ID!, $columnId: String!, $columnValue: String!){
      items_page_by_column_values (board_id: $boardId, columns: [{column_id: $columnId, column_values: [$columnValue]}]) {
        cursor
        items {
          id
          name
          column_values {
            id
            value
            text
          }
        }
      }
    }
  `,
};
