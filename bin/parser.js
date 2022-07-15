import _ from "lodash";

export default (rssLink, instance) => {
  const parserRss = new DOMParser();
  const feedXML = parserRss.parseFromString(
    rssLink.data.contents,
    "application/xml"
  );
  if (!feedXML.querySelector("rss")) {
    throw new Error(instance.t(
      "validateRss.errors.textNotRss"
    ));
  }

  const posts = [...feedXML.querySelectorAll("item")].map((item, index) => {
    const postIdLast = [...document.querySelectorAll("[data-id]")].length;
    console.log(postIdLast)
    return {
      postId: postIdLast + index,
      title: item.querySelector("title").innerHTML,
      link: item.querySelector("link").innerHTML,
      description: item.querySelector("description").innerHTML,
    };
  })
  .reverse();

  const feeds = _.fromPairs(
    [...feedXML.querySelector("channel").children]
      .filter((childe) => childe.tagName !== "item")
      .filter((childe) => childe.tagName !== "webMaster")
      .map((item) => {
        return [item.tagName, item.textContent];
      })
  );

  return { posts , feeds };
};
