import watcherState from "./watcher.js";
import * as yup from "yup";
import { setLocale } from "yup";
import _ from "lodash";
import parser from "./parser.js";
import axios from "axios";

export default (instance) => {
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
    rssData: null,
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
    const allOrigins =
      "https://allorigins.hexlet.app/get?disableCache=true&url=";
    schema
      .validate({ url: inputRssValue })
      .then(({ url }) => axios(`${allOrigins}${encodeURIComponent(url)}`))
      .then((request) => parser(request, instance))
      .then((rssDoc) => {
        watchedState.rssData = rssDoc;
        watchedState.form.urlValid.push(inputRssValue);
        watchedState.form.messeg = instance.t(
          "validateRss.notErrors.textValid"
        );
        watchedState.form.state = true;
      })
      .catch((e) => {
        e.errors  
         ? (watchedState.form.messeg = e.errors)
         : (watchedState.form.messeg = e.message)
        watchedState.form.state = false;
      });
      input.reset();
  });
};
