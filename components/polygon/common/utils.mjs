export const parseNextPage = (nextUrl = null) => {
  if (nextUrl) {
    const url = new URL(nextUrl);
    nextUrl = url.searchParams.get("cursor");
  }
  return nextUrl;
};
