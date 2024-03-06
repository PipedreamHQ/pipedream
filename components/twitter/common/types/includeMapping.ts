type IdCollection = (string | string[])[];

export interface IncludesIdCollection {
  mediaKeys?: IdCollection;
  placeIds?: IdCollection;
  pollIds?: IdCollection;
  tweetIds?: IdCollection;
  userIds?: IdCollection;
  userNames?: IdCollection;
}
