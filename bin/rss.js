import watcherState from "./watcher.js";
import * as yup from "yup";
import { setLocale } from "yup";
import _ from "lodash";
import parser from "./parser.js";
import axios from "axios";

export default (instance) => {
  const allOrigins = "https://allorigins.hexlet.app/get?disableCache=true&url=";

  setLocale({
    string: {
      url: instance.t("validateRss.errors.textError"),
    },
    mixed: {
      notOneOf: instance.t("validateRss.errors.textUrlRepeat"),
    },
  });

  const createSchema = (data) => {
    return yup.object().shape({
      url: yup.string().url().notOneOf(data),
    });
  };

  const state = {
    form: {
      state: "",
      messeg: null,
      urlValid: [],
    },
    rssData: [],
  };
  const watchedState = watcherState(state);
  const form = document.querySelector("form");
  form.focus();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target;
    const formData = new FormData(e.target);
    const inputRssValue = formData.get("url");
    const schema = createSchema(watchedState.form.urlValid);
    schema
      .validate({ url: inputRssValue })
      .then(({ url }) => axios(`${allOrigins}${encodeURIComponent(url)}`))
      .then((request) => parser(request, instance))
      .then((rssDoc) => watchedState.rssData.push(rssDoc))
      .then(() => watchedState.form.urlValid.push(inputRssValue))
      .then(
        () =>
          (watchedState.form.messeg = instance.t(
            "validateRss.notErrors.textValid"
          ))
      )
      .then(() => (watchedState.form.state = true))
      .catch((e) => {
        e.errors
          ? (watchedState.form.messeg = e.errors)
          : (watchedState.form.messeg = e.message);
        watchedState.form.state = false;
      });
    const request = () => {
      watchedState.form.urlValid.map((elem) => {
        axios(`${allOrigins}${encodeURIComponent(elem)}`)
          .then((request) => parser(request))
          .then(({posts : delayRssPosts}) => {
            const postsData =  watchedState.rssData.map(({posts}) => posts);
            const posts = _.flattenDeep(postsData);
            const difference = _.differenceBy(delayRssPosts, posts, "link");
            // console.log(difference, difference.length); длинна и элементы новых постов
              if (difference.length >= 1) {
                watchedState.rssData.push({posts: difference, feeds: null});
              }
            });
          })
        timerId = setTimeout(request, delay);
    };
    const delay = 5000;
    let timerId = setTimeout(request, delay);
    input.reset();
  });
};
