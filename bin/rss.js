import watcherState from './watcher.js';
import * as yup from 'yup';
import { setLocale } from 'yup';
import _ from 'lodash';

setLocale({
  string: {
    url: 'Ссылка должна быть валидным URL'
  },
  mixed: {
    notOneOf: 'RSS уже существует',
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
    const schema = createSchema(watchedState.form.rss)
    schema.validate ({url: inputRssValue})
    .then(() => {
      watchedState.form.massage = 'RSS успешно загружен';
      watchedState.form.rss.push(inputRssValue);
      watchedState.form.state = true;
    })
    .catch((e) => {
      watchedState.form.massage = e.errors;
      watchedState.form.state = false;
    })
  });
};
