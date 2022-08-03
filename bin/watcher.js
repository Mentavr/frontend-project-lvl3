import onChange from 'on-change';
import _ from 'lodash';

export default (state) => onChange(state, function change(path, value) {
  const input = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');
  const isDanger = feedback.classList.contains('text-danger');
  switch (path) {
    case 'form.state':
      if (value) {
        if (isDanger) {
          feedback.classList.remove('text-danger');
        }
        feedback.classList.add('text-success');
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      }
      if (!value) {
        console.log(value, 'watcher false');
        if (!isDanger) {
          feedback.classList.add('text-danger');
        }
        if (!input.classList.contains('is-invalid')) {
          input.classList.add('is-invalid');
        }
      }
      break;
    case 'form.validMessaeg':
      // console.log(value, 'watcher valid Messag');
      feedback.textContent = value;
      break;

    case 'targetPosts':
    case 'rssData': {
      const { rssData } = this;
      const { targetPosts } = this;

      // console.log(rssData, targetPosts);

      const divFeeds = document.querySelector('.feeds');
      const divPosts = document.querySelector('.posts');

      divFeeds.innerHTML = '';
      divPosts.innerHTML = '';

      const postsRss = rssData.map(({ posts }) => posts);
      const feedsRss = rssData.map(({ feeds }) => feeds).filter((feed) => feed);
      // const targetsPosts = _.flattenDeep(targetRssPosts);
      const posts = _.flattenDeep(postsRss);
      const feeds = _.flattenDeep(feedsRss);

      // console.log(posts, feeds, 'posts, feeds');

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
      const feedsDom = createDom('Feed');
      const postDom = createDom('Post');

      addClass(feedsDom, 'Feed');
      addClass(postDom, 'Post');

      const {
        divFeedCard, divFeedCardBody, divFeedCardTitle, listFeed,
      } = feedsDom;

      const {
        divPostCard, divPostCardBody, divPostCardTitle, listPost,
      } = postDom;

      divFeedCardTitle.textContent = 'Фиды';
      divPostCardTitle.textContent = 'Посты';

      divFeeds.append(divFeedCard);
      divFeedCard.append(divFeedCardBody);
      divFeedCard.append(listFeed);
      divFeedCardBody.append(divFeedCardTitle);

      divPosts.append(divPostCard);
      divPostCard.append(divPostCardBody);
      divPostCard.append(listPost);
      divPostCardBody.append(divPostCardTitle);

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

      const postItemsAdd = () => {
        posts.reverse();
        posts.forEach((post) => {
          const listPostGroup = document.querySelector('.posts .list-group');
          const itemPost = document.createElement('li');
          const linkItemPost = document.createElement('a');
          const itemPostButton = document.createElement('button');

          itemPostButton.setAttribute('type', 'button');
          itemPostButton.setAttribute('data-id', post.postId);
          linkItemPost.setAttribute('href', post.link);
          linkItemPost.setAttribute('target', '_blank');
          linkItemPost.setAttribute('data-id', post.postId);

          itemPostButton.textContent = 'Просмотр';
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
      feedItemsAdd();
      if (targetPosts) {
        targetPosts.forEach(({ postId }) => {
          const targetId = document.querySelector(`[data-id="${postId}"]`);
          targetId.classList.add('fw-normal', 'link-secondary');
          targetId.classList.remove('fw-bold');
        });
      }
    }
      break;
    case 'modalWindow': {
      const { filterPosts, modal } = value;
      const body = document.querySelector('body');
      const myModal = document.getElementById('modal');
      const modalTitle = document.querySelector('.modal-title');
      const modalText = document.querySelector('.text-break');
      const modalLink = document.querySelector('.modal-footer a');

      const modelOpen = () => {
        const backgroundDiv = document.createElement('div');

        body.classList.add('modal-open');
        myModal.classList.add('show');
        backgroundDiv.classList.add('modal-backdrop', 'fade', 'show');

        modalLink.setAttribute('href', filterPosts.link);
        body.setAttribute('style', 'overflow: hidden; padding-right: 0px;');
        myModal.setAttribute('aria-modal', 'true');
        myModal.setAttribute('style', 'display: block');

        myModal.removeAttribute('aria-hidden');

        modalTitle.textContent = filterPosts.title;
        modalText.textContent = filterPosts.description;

        body.append(backgroundDiv);
      };

      const modelClose = () => {
        const backgroundDiv = document.querySelector('.modal-backdrop');
        backgroundDiv.remove();

        body.classList.remove('modal-open');
        myModal.classList.remove('show');

        modalLink.removeAttribute('href');
        body.removeAttribute('style');
        myModal.removeAttribute('style');
        myModal.removeAttribute('aria-modal');

        myModal.setAttribute('aria-hidden', 'true');
        myModal.setAttribute('style', 'display: none');
      };
      switch (modal) {
        case 'close':
          modelClose();
          break;
        case 'open':
          modelOpen();
          break;
        default:
          throw new Error('error');
      }
    }
      break;
    default:
      throw new Error('что-то пошло не так');
  }
});
