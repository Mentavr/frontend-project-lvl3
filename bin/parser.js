import _ from "lodash";

export default (link, instance) => {
  const parserRss = new DOMParser();
  const feedXML = parserRss.parseFromString(
    link.data.contents,
    "application/xml"
  );
  if (!feedXML.querySelector("rss")) {
    throw new Error(instance.t(
      "validateRss.errors.textNotRss"
    ));
  }

  const posts = [...feedXML.querySelectorAll("item")].map((item, index) => {
    const postIdLast = [...document.querySelectorAll("[data-id]")].length;
    return {
      postId: postIdLast + index,
      title: item.querySelector("title").innerHTML,
      link: item.querySelector("link").innerHTML,
      description: item.querySelector("description").innerHTML,
    };
  });

  const feeds = _.fromPairs(
    [...feedXML.querySelector("channel").children]
      .filter((childe) => childe.tagName !== "item")
      .filter((childe) => childe.tagName !== "webMaster")
      .map((item) => {
        return [item.tagName, item.textContent];
      })
  );

  return [{ posts }, { feeds }];
};
