type IncludesIdMap<T> = {
  mediaKeys?: T;
  placeIds?: T;
  pollIds?: T;
  tweetIds?: T;
  userIds?: T;
  userNames?: T;
};

export type IncludesIdCollection = IncludesIdMap<(string | string[])[]>;
export type IncludesIdCollectionFlattened = IncludesIdMap<string[]>;
