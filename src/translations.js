export default {
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        interface: {
          posts: 'Посты',
          feeds: 'Фиды',
          view: 'Просмотр',
        },
        validateRss: {
          errors: {
            textError: 'Ссылка должна быть валидным URL',
            textUrlRepeat: 'RSS уже существует',
            textNotRss: 'Ресурс не содержит валидный RSS',
            textErrorNetwork: 'Ошибка сети',
          },
          notErrors: {
            textValid: 'RSS успешно загружен',
          },
        },
      },
    },
  },
};
