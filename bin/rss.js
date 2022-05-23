import watcherState from './watcher.js';
import * as yup from 'yup';
import { setLocale } from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import instance from './instance.js'

const i18nextInstance = i18next.createInstance();
i18nextInstance.init(instance);


setLocale({
  string: {
    url: i18nextInstance.t('validateRss.errors.textError'),
  },
  mixed: {
    notOneOf: i18nextInstance.t('validateRss.errors.textUrlRepeat'),
  }
});

const createSchema = (data) => {
  return yup.object().shape({
    url: yup.string().url().notOneOf(data),
  });
}

export default  () => {
  const state = {
    form: {
      state: '',
      massage: null,
      rss: [],
    },
  };
  const watchedState = watcherState(state);
  const form = document.querySelector('form');
  form.focus();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputRssValue = formData.get('url');
    const schema = createSchema(watchedState.form.rss);
    schema.validate ({url: inputRssValue})
    .then(() => {
      watchedState.form.massage = i18nextInstance.t('validateRss.notErrors.textValid');
      watchedState.form.rss.push(inputRssValue);
      watchedState.form.state = true;
    })
    .catch((e) => {
      watchedState.form.massage = e.errors;
      watchedState.form.state = false;
    })
  });
};
