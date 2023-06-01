import {
  DirectMessage,
  List,
  Tweet, User,
} from "../../common/types/responseSchemas";

const SUMMARY_TEXT_MAX_LENGTH = 30;

export function getListSummary({ name }: List) {
  return name;
}

export function getTweetSummary({ text }: Tweet | DirectMessage) {
  return text.length > SUMMARY_TEXT_MAX_LENGTH
    ? text.slice(0, SUMMARY_TEXT_MAX_LENGTH) + "..."
    : text;
}

export function getUserSummary({ username }: User) {
  return username;
}
