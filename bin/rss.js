import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';
import _ from 'lodash';
import parser from './parser.js';
import watcherState from './watcher.js';

export default (instance) => {
  const allOrigins = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  setLocale({
    string: {
      url: instance.t('validateRss.errors.textError'),
    },
    mixed: {
      notOneOf: instance.t('validateRss.errors.textUrlRepeat'),
    },
  });

  const createSchema = (data) => yup.object().shape({
    url: yup.string().url().notOneOf(data),
  });

  const state = {
    form: {
      state: '',
      validMessaeg: null,
    },
    rssData: [],
    modalWindow: '',
    targetPosts: [],
  };
  const watchedState = watcherState(state);
  const form = document.querySelector('form');
  form.focus();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target;
    const formData = new FormData(e.target);
    const inputRssValue = formData.get('url');
    const urlsValid = watchedState.rssData.map(({ dataRssLink }) => dataRssLink);
    const schema = createSchema(urlsValid);
    schema
      .validate({ url: inputRssValue })
      .then(({ url }) => axios(`${allOrigins}${encodeURIComponent(url)}`))
      .then((request) => parser(request, instance))
      .then((rssDoc) => {
        watchedState.rssData.push(rssDoc);
        const validRss = instance.t('validateRss.notErrors.textValid');
        watchedState.form.validMessaeg = validRss;
        watchedState.form.state = true;
      });
      // .catch((error) => {
      //   watchedState.form.state = false;
      //   if (error.isAxiosError) {
      //     watchedState.form.validMessaeg = instance.t('validateRss.errors.textErrorNetwork');
      //   } else {
      //     watchedState.form.validMessaeg = error.message;
      //   }
      // });
    const delay = 5000;
    setTimeout(function request() {
      watchedState.rssData.forEach(({ dataRssLink }) => {
        axios(`${allOrigins}${encodeURIComponent(dataRssLink)}`)
          .then((rssData) => parser(rssData))
          .then((data) => {
            const postsData = watchedState.rssData.map(({ posts }) => posts);
            const posts = _.flattenDeep(postsData);
            const difference = _.differenceBy(data.posts, posts, 'link');
            if (difference.length >= 1) {
              watchedState.rssData.push({ posts: difference, feeds: null, dataRssLink });
            }
          });
      });
      setTimeout(request, delay);
    }, delay);
    // input.reset();
  });

  // открытие модального окна
  const postItems = document.querySelector('.posts');
  postItems.addEventListener('click', ({ target }) => {
    const targetPost = target;
    const postId = target.dataset.id;
    const postsData = watchedState.rssData.map(({ posts }) => posts);
    const posts = _.flattenDeep(postsData);
    const filterPosts = posts.find((elem) => elem.postId === postId);
    const nameTag = targetPost.localName;
    switch (nameTag) {
      case 'button':
        watchedState.modalWindow = { filterPosts, modal: 'open' };
        watchedState.targetPosts.push({ postId: filterPosts.postId });
        break;
      case 'a':
        watchedState.targetPosts.push({ postId: filterPosts.postId });
        break;
      default:
        throw new Error('modal windoow did not open');
    }
  });

  // закрытие модальношо окна
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
