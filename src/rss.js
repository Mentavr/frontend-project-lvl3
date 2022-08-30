import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import parser from './parser.js';
import watcherState from './watcher.js';
import interfaceTranslations from './translations.js';

const createSchema = (data) => yup.object().shape({
  url: yup.string().url().notOneOf(data),
});

const validateUrl = (url, feeds) => {
  const urlsValid = feeds.map(({ urlValid }) => urlValid);
  const schema = createSchema(urlsValid);
  return schema
    .validate({ url });
};

export default () => {
  setLocale({
    string: {
      url: 'validateRss.errors.textError',
    },
    mixed: {
      notOneOf: 'validateRss.errors.textUrlRepeat',
    },
  });

  const translation = i18next.createInstance();
  translation.init(interfaceTranslations);

  const allOrigins = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

  const state = {
    state: 'waiting',
    form: {
      validMessaeg: null,
    },
    posts: [],
    feeds: [],
    modalWindow: '',
    targetPosts: [],
  };
  const watchedState = watcherState(state, translation);
  const form = document.querySelector('form');
  watchedState.state = 'waiting';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputUrlValue = formData.get('url');
    validateUrl(inputUrlValue, watchedState.feeds)
      .then(({ url }) => axios(`${allOrigins}${encodeURIComponent(url)}`))
      .then((request) => {
        watchedState.state = 'processing';
        const validRss = 'validateRss.notErrors.textValid';
        const { postsParser, feedsParser } = parser(request);
        const posts = postsParser.map((post) => ({ ...post, postId: _.uniqueId() }));
        const feeds = ({ ...feedsParser, urlValid: inputUrlValue });
        watchedState.posts.push(posts);
        watchedState.feeds.push(feeds);
        watchedState.form.validMessaeg = validRss;
        watchedState.state = 'success';
      })
      .then(() => {
        const delay = 5000;
        const request = () => axios(`${allOrigins}${encodeURIComponent(inputUrlValue)}`)
          .then((data) => {
            const { postsParser: newPostsParser } = parser(data);
            const postsData = watchedState.posts;
            const posts = _.flattenDeep(postsData);
            const difference = _.differenceBy(newPostsParser, posts, 'link')
              .map((post) => ({ ...post, postId: _.uniqueId() }));
            if (difference.length >= 1) {
              watchedState.posts.push(difference);
            }
            setTimeout(request, delay);
          });
        setTimeout(() => {
          request();
        }, delay);
      })
      .catch((error) => {
        watchedState.state = 'failed';
        if (error.isAxiosError) {
          watchedState.form.validMessaeg = 'validateRss.errors.textErrorNetwork';
        } else {
          watchedState.form.validMessaeg = error.message;
        }
      });
  });

  // открытие модального окна
  const postItems = document.querySelector('.posts');
  postItems.addEventListener('click', ({ target }) => {
    const targetPost = target;
    const postId = target.dataset.id;
    const postsData = watchedState.posts;
    const posts = _.flattenDeep(postsData);
    const filterPosts = posts.find((elem) => elem.postId === postId);
    const filterPostId = filterPosts.postId;
    const nameTag = targetPost.localName;
    switch (nameTag) {
      case 'button':
        watchedState.modalWindow = { filterPostId, modal: 'open' };
        watchedState.targetPosts = [...watchedState.targetPosts, filterPostId];
        break;
      case 'a':
        watchedState.targetPosts = [...watchedState.targetPosts, filterPostId];
        break;
      default:
        throw new Error('modal windoow did not open');
    }
  });

  // закрытие модального окна
  const myModal = document.getElementById('modal');
  myModal.addEventListener('click', ({ target }) => {
    const targetPost = target;
    const nameTag = targetPost.localName;
    switch (nameTag) {
      case 'button':
        watchedState.modalWindow = {
          modal: 'close',
        };
        break;
      default:
        throw Error('modal windoow did not close');
    }
  });
};
