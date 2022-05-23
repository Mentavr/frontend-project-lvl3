import onChange from "on-change";
import _ from "lodash";

export default (state) =>
  onChange(state, (path, value) => {
    // текст с выводом ошибки и правильной валидации
    // const text = {
    //   textError : 'Ссылка должна быть валидным URL',
    //   textValid : 'RSS успешно загружен',
    //   textUrlRepeat : 'RSS уже существует',
    //   textNotRss : 'Ресурс не содержит валидный RSS',
    // }
    const input = document.querySelector(".form-control");
    const feedback = document.querySelector(".feedback");
    const isDanger = feedback.classList.contains("text-danger");
    switch (path) {
      case 'form.state':
        if (value) {
          if (isDanger) {
            feedback.classList.remove("text-danger");
          }
          feedback.classList.add("text-success");
          if (input.classList.contains("is-invalid")) {
            input.classList.remove("is-invalid");
          }
        }
        if (!value) {
          console.log(value, "watcher false");
          if (!isDanger) {
            feedback.classList.add("text-danger");
          }
          if (!input.classList.contains("is-invalid")) {
            input.classList.add("is-invalid");
          }
        }
        break;
      case 'form.massage':
        console.log(state.form.massage, 'asd')
        feedback.textContent = state.form.massage;
        break;
    }
  });
