export interface List {
  id: string;
  name: string;
}

export interface Tweet {
  id: string;
  text: string;
  edit_history_tweet_ids: string[];
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface PaginatedResponse {
  data: object[];
  next_token: string;
}