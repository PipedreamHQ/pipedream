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
        items (
          newest_first: true
        ) {
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
  getBoard: `
    query getBoard($id: Int!) {
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
        items {
          id
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
    query getUser($id: Int!) {
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
};
