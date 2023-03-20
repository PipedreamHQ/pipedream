export interface TwitterEntity {
  id: string;
}

export type TwitterEntityMap = Record<string, object>;

export interface List extends TwitterEntity {
  name: string;
}

export interface Tweet extends TwitterEntity {
  text: string;
  edit_history_tweet_ids: string[];
  referenced_tweets?: ReferencedTweet[];
  includes?: {
    tweets?: Tweet[];
  };
}

export interface ReferencedTweet {
  id: string;
  type: "retweeted" | "quoted" | "replied_to";
}

export interface User extends TwitterEntity {
  name: string;
  username: string;
}

export interface PaginatedResponse {
  data: object[];
  next_token: string;
}
