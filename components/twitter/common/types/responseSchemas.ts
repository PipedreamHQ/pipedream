export interface TwitterEntity {
  id: string;
}

export type TwitterEntityMap = Record<string, object>;

export interface DirectMessage extends TwitterEntity {
  event_type: "MessageCreate",
  text: string;
}

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

interface ResponseIncludes {
  users?: User[];
  tweets?: Tweet[];
}

interface ResponseBase {
  includes?: ResponseIncludes;
  errors?: object;
}

export type ResponseObject<T extends TwitterEntity> = ResponseBase & {
  data?: T | T[];
};

export type PaginatedResponseObject<T extends TwitterEntity> = ResponseBase & {
  data?: T[];
  meta?: {
    next_token?: string;
    result_count: number;
  };
};
