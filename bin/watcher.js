import onChange from "on-change";
import _ from "lodash";

export default (state) =>
  onChange(state, (path, value) => {
    const input = document.querySelector('.form-control');
    const feedback = document.querySelector('.feedback');
    const isDanger = feedback.classList.contains('text-danger');
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
        feedback.textContent = state.form.massage;
        break;
    }
  });
