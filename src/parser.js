import _ from 'lodash';

export default (rssLink) => {
  console.log(rssLink);
  const parserRss = new DOMParser();
  const feedXML = parserRss.parseFromString(
    rssLink.data.contents,
    'application/xml',
  );
  if (!feedXML.querySelector('rss')) {
    throw new Error('validateRss.errors.textNotRss');
  }
  const postsParser = [...feedXML.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').innerHTML,
    link: item.querySelector('link').innerHTML,
    description: item.querySelector('description').innerHTML,
  }))
    .reverse();

  const feedsParser = _.fromPairs(
    [...feedXML.querySelector('channel').children]
      .filter((childe) => childe.tagName !== 'item')
      .filter((childe) => childe.tagName !== 'webMaster')
      .map((item) => [item.tagName, item.textContent]),
  );
  return { postsParser, feedsParser };
};
