export interface ListFields {
  expansions?: string;
  "list.fields"?: string;
  "user.fields"?: string;
}

export interface MessageFields {
  expansions?: string;
  "dm_event.fields"?: string;
  "media.fields"?: string;
  "tweet.fields"?: string;
  "user.fields"?: string;
}

export interface UserFields {
  expansions?: string;
  "tweet.fields"?: string;
  "user.fields"?: string;
}

export interface TweetFields {
  expansions?: string;
  "media.fields"?: string;
  "place.fields"?: string;
  "poll.fields"?: string;
  "tweet.fields"?: string;
  "user.fields"?: string;
}
