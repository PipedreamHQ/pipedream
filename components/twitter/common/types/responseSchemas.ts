export interface TwitterEntity {
  id: string;
}

export type TwitterEntityMap = Record<string, object>;

export interface DirectMessage extends TwitterEntity, HasMediaAttachments, HasReferencedTweets {
  event_type: "MessageCreate";
  text: string;
  sender_id?: string;
  participant_ids?: string[];
}

export interface List extends TwitterEntity {
  name: string;
  owner_id?: string;
}

interface MetricsFields {
  public_metrics?: string;
  non_public_metrics?: string;
  organic_metrics?: string;
  promoted_metrics?: string;
}

interface HasReferencedTweets {
  referenced_tweets?: ReferencedTweet[];
}
interface HasMediaAttachments {
  attachments?: {
    media_keys?: string[];
  };
}

export interface Tweet
  extends TwitterEntity,
    MetricsFields,
    HasReferencedTweets {
  text: string;
  author_id?: string;
  edit_history_tweet_ids?: string[];
  in_reply_to_user_id?: string;
  attachments?: HasMediaAttachments["attachments"] & {
    poll_ids: string[];
  };
  geo?: {
    place_id: string;
  };
  entities?: {
    mentions?: User[];
  };
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
  pinned_tweet_id?: string;
}

type Poll = TwitterEntity;
type Place = TwitterEntity;

export interface ResponseIncludes {
  places?: Place[];
  polls?: Poll[];
  users?: User[];
  tweets?: Tweet[];
  media?: MediaItem[];
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

interface MediaItem {
  media_key: string;
}
