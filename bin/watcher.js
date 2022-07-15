import onChange from "on-change";
import _ from "lodash";

export default (state) =>
  onChange(state, (path, value) => {
    const input = document.querySelector(".form-control");
    const feedback = document.querySelector(".feedback");
    const isDanger = feedback.classList.contains("text-danger");
    switch (path) {
      case "form.state":
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
      case "form.messeg":
        console.log(value);
        feedback.textContent = value;
        break;

      case "rssData":
        console.log(value);

        const divFeeds = document.querySelector(".feeds");
        const divPosts = document.querySelector(".posts");

        const replaceDivPosts = document.createElement("div");
        const replaceDivFeeds = document.createElement("div");

        replaceDivFeeds.classList.add(
          "col-md-10",
          "col-lg-4",
          "mx-auto",
          "order-0",
          "order-lg-1",
          "feeds"
        );
        replaceDivPosts.classList.add(
          "col-md-10",
          "col-lg-8",
          "order-1",
          "mx-auto",
          "posts"
        );

        const postsRss = value.map(({ posts }) => posts);
        const feedsRss = value.map(({ feeds }) => feeds)
        .filter((feed) => feed)
        const posts = _.flattenDeep(postsRss);
        const feeds = _.flattenDeep(feedsRss);

        console.log(posts, feeds, 'posts and feeds');

        const createDom = (name) => {
          const creater = {};
          creater[`div${name}Card`] = document.createElement("div");
          creater[`div${name}CardBody`] = document.createElement("div");
          creater[`list${name}`] = document.createElement("ul");
          creater[`div${name}CardTitle`] = document.createElement("h2");
          return creater;
        };

        const addClass = (data, name) => {
          data[`div${name}Card`].classList.add("card", "border-0");
          data[`div${name}CardBody`].classList.add("card-body");
          data[`div${name}CardTitle`].classList.add("card-title", "h4");
          data[`list${name}`].classList.add(
            "list-group",
            "border-0",
            "rounded-0"
          );
        };
        const feed = createDom("Feed");
        const post = createDom("Post");

        addClass(feed, "Feed");
        addClass(post, "Post");

        const { divFeedCard, divFeedCardBody, divFeedCardTitle, listFeed } =
          feed;

        const { divPostCard, divPostCardBody, divPostCardTitle, listPost } =
          post;

        divFeedCardTitle.textContent = "Фиды";
        divPostCardTitle.textContent = "Посты";

        replaceDivFeeds.append(divFeedCard);
        divFeedCard.append(divFeedCardBody);
        divFeedCard.append(listFeed);
        divFeedCardBody.append(divFeedCardTitle);

        replaceDivPosts.append(divPostCard);
        divPostCard.append(divPostCardBody);
        divPostCard.append(listPost);
        divPostCardBody.append(divPostCardTitle);

        divPosts.replaceWith(replaceDivPosts);
        divFeeds.replaceWith(replaceDivFeeds);

        const feedItemsAdd = () => {
          feeds.forEach((feed) => {
            const titleFeeds = document.createElement("h3");
            const descriptionFeeds = document.createElement("p");
            const itemFeed = document.createElement("li");
            const listFeed = document.querySelector(".feeds .list-group");

            itemFeed.classList.add(
              "list-group-item",
              "border-0",
              "border-end-0"
            );
            titleFeeds.classList.add("h6", "m-0");
            descriptionFeeds.classList.add("m-0", "small", "text-black-50");
            titleFeeds.textContent = feed.title;
            descriptionFeeds.textContent = feed.description;

            listFeed.prepend(itemFeed);
            itemFeed.append(titleFeeds);
            itemFeed.append(descriptionFeeds);
          });
        };

        const postItemsAdd = () => {
          posts.reverse();
          posts.forEach((post) => {
            const listPost = document.querySelector(".posts .list-group");
            const itemPost = document.createElement("li");
            const linkItemPost = document.createElement("a");
            const itemPostButton = document.createElement("button");

            itemPostButton.setAttribute("type", "button");
            linkItemPost.setAttribute("href", post.link);
            linkItemPost.setAttribute("target", "_blank");
            linkItemPost.setAttribute("data-id", post.postId);

            itemPostButton.textContent = "Просмотр";
            linkItemPost.textContent = post.title;

            linkItemPost.classList.add("fw-bold");
            itemPostButton.classList.add(
              "btn",
              "btn-outline-primary",
              "btn-sm"
            );
            itemPost.classList.add(
              "list-group-item",
              "d-flex",
              "justify-content-between",
              "align-items-start",
              "border-0",
              "border-end-0"
            );
            itemPost.append(linkItemPost);
            itemPost.append(itemPostButton);
            listPost.append(itemPost);
          });
        };
          postItemsAdd();
          feedItemsAdd();
        break;
    }
  });
