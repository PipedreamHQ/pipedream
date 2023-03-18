import {
  Tweet, User,
} from "../../common/types/responseSchemas";

export function getUserSummary({ name }: User) {
  return name;
}

export function getTweetSummary({ text }: Tweet) {
  const TWEET_SUMMARY_MAX_LENGTH = 30;
  return text.length > TWEET_SUMMARY_MAX_LENGTH
    ? text.slice(0, TWEET_SUMMARY_MAX_LENGTH) + "..."
    : text;
}
