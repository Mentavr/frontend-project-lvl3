import onChange from 'on-change';

const createDom = (name) => {
  const creater = {};
  creater[`div${name}Card`] = document.createElement('div');
  creater[`div${name}CardBody`] = document.createElement('div');
  creater[`list${name}`] = document.createElement('ul');
  creater[`div${name}CardTitle`] = document.createElement('h2');
  return creater;
};

const addClass = (data, name) => {
  data[`div${name}Card`].classList.add('card', 'border-0');
  data[`div${name}CardBody`].classList.add('card-body');
  data[`div${name}CardTitle`].classList.add('card-title', 'h4');
  data[`list${name}`].classList.add(
    'list-group',
    'border-0',
    'rounded-0',
  );
};

const targetPost = (postsId) => {
  postsId.forEach((id) => {
    const targetId = document.querySelector(`[data-id="${id}"]`);
    targetId.classList.add('fw-normal', 'link-secondary');
    targetId.classList.remove('fw-bold');
  });
};

export default (state, translation) => onChange(state, (path, value) => {
  const targetIdPost = state.targetPosts;
  const input = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');
  const isDanger = feedback.classList.contains('text-danger');
  switch (path) {
    case 'state':
      if (value === 'processing') {
        if (isDanger) {
          feedback.classList.remove('text-danger');
        }
        feedback.classList.add('text-success');
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      }
      if (value === 'failed') {
        if (!isDanger) {
          feedback.classList.add('text-danger');
        }
        if (!input.classList.contains('is-invalid')) {
          input.classList.add('is-invalid');
        }
      }
      if (value === 'success') {
        input.value = '';
        input.focus();
      }
      break;
    case 'form.validMessaeg':
      feedback.textContent = translation.t(value);
      break;
    case 'posts': {
      const divPosts = document.querySelector('.posts');
      divPosts.innerHTML = '';
      const posts = [...value];
      const postDom = createDom('Post');
      addClass(postDom, 'Post');

      const {
        divPostCard, divPostCardBody, divPostCardTitle, listPost,
      } = postDom;
      divPostCardTitle.textContent = translation.t('interface.posts');

      divPosts.append(divPostCard);
      divPostCard.append(divPostCardBody);
      divPostCard.append(listPost);
      divPostCardBody.append(divPostCardTitle);
      const postItemsAdd = () => {
        posts.reverse();
        posts.forEach((post) => {
          const listPostGroup = document.querySelector('.posts .list-group');
          const itemPost = document.createElement('li');
          const linkItemPost = document.createElement('a');
          const itemPostButton = document.createElement('button');

          itemPostButton.setAttribute('data-bs-target', '#modal');
          itemPostButton.setAttribute('data-bs-toggle', 'modal');
          itemPostButton.setAttribute('type', 'button');
          itemPostButton.setAttribute('data-id', post.postId);
          linkItemPost.setAttribute('href', post.link);
          linkItemPost.setAttribute('target', '_blank');
          linkItemPost.setAttribute('data-id', post.postId);

          itemPostButton.textContent = translation.t('interface.view');
          linkItemPost.textContent = post.title;

          linkItemPost.classList.add('fw-bold');
          itemPostButton.classList.add(
            'btn',
            'btn-outline-primary',
            'btn-sm',
          );
          itemPost.classList.add(
            'list-group-item',
            'd-flex',
            'justify-content-between',
            'align-items-start',
            'border-0',
            'border-end-0',
          );
          itemPost.append(linkItemPost);
          itemPost.append(itemPostButton);
          listPostGroup.append(itemPost);
        });
      };
      postItemsAdd();
      targetPost(targetIdPost);
    }
      break;
    case 'feeds': {
      const divFeeds = document.querySelector('.feeds');
      divFeeds.innerHTML = '';
      const feeds = [...value];
      const feedsDom = createDom('Feed');
      addClass(feedsDom, 'Feed');
      const {
        divFeedCard, divFeedCardBody, divFeedCardTitle, listFeed,
      } = feedsDom;
      divFeedCardTitle.textContent = translation.t('interface.feeds');

      divFeeds.append(divFeedCard);
      divFeedCard.append(divFeedCardBody);
      divFeedCard.append(listFeed);
      divFeedCardBody.append(divFeedCardTitle);

      const feedItemsAdd = () => {
        feeds.forEach((feed) => {
          const titleFeeds = document.createElement('h3');
          const descriptionFeeds = document.createElement('p');
          const itemFeed = document.createElement('li');
          const listFeedGroup = document.querySelector('.feeds .list-group');

          itemFeed.classList.add(
            'list-group-item',
            'border-0',
            'border-end-0',
          );
          titleFeeds.classList.add('h6', 'm-0');
          descriptionFeeds.classList.add('m-0', 'small', 'text-black-50');
          titleFeeds.textContent = feed.title;
          descriptionFeeds.textContent = feed.description;

          listFeedGroup.prepend(itemFeed);
          itemFeed.append(titleFeeds);
          itemFeed.append(descriptionFeeds);
        });
      };
      feedItemsAdd();
    }
      break;
    case 'targetPosts':
      targetPost(targetIdPost);
      break;
    case 'modalWindow': {
      const post = state.posts.find((item) => item.postId === value);
      const modalTitle = document.querySelector('.modal-title');
      const modalText = document.querySelector('.text-break');
      const modalLink = document.querySelector('.modal-footer a');

      modalTitle.textContent = post.title;
      modalText.textContent = post.description;
      modalLink.setAttribute('href', post.link);
    }
      break;
    default:
      throw new Error('something went wrong');
  }
});
