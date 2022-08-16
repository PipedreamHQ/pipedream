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
    query listGroups ($boardId: Int!) {
      boards (ids: [$boardId]) {
        groups {
          id
          title
        }
      }
    }
  `,
  listItemsBoard: `
    query listItems ($boardId: Int!) {
      boards (ids: [$boardId]) {
        items {
          id
          name
        }
      }
    }
  `,
  listUpdatesBoard: `
    query listUpdates (
      $boardId: Int!,
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
    query listColumns ($boardId: Int!) {
      boards (ids: [$boardId]) {
        columns {
          id
          title
        }
      }
    }
  `,
  getItem: `
    query getItem ($id: Int!) {
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
};
