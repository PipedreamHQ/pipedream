export default function myImageLoader({
  src, width, quality,
}) {
  return `https://pipedream.com${src}?w=${width}&q=${quality || 75}`;
}
