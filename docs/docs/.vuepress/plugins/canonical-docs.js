module.exports = (options = {}, ctx) => ({
  extendPageData($page) {
    $page.canonicalUrl = `https://pipedream.com/docs${$page.path}`;
  }
});
