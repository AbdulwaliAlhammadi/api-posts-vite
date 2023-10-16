import { el, els, setStorage, getStorage, updateHtml, showToast } from "./common-spec.js";

import axios from "axios";

let btnValue = 0;

const fetchPosts = () => {
  const pContainer = el("#post-container", body);
  const spinnerDiv = `
    <div id="spinner" role="status"></div>
    <div class="spinner">Loading...</div>
  `;

  updateHtml(pContainer, spinnerDiv);
  axios.get("https://jsonplaceholder.typicode.com/posts/")
    .then((response) => {
      const posts = response.data;
      setStorage("posts", posts);
      renderPosts();
      showToast(1,"Posts fetched successfully!");
    })
    .catch((error) => {
      const posts = [];
      setStorage("posts", posts);
      renderPosts();
      showToast(3, "Posts fetched failed! " + error.code + ": "+ error);
      // throw new Error(`HTTP error! Status: ${error}`);
    });
};

const getPosts = () => {
  return getStorage("posts", []);
};

const renderPosts = () => {
  const allPosts = getPosts();
  const postNo = el("#postNo");
  const pContainer = el("#post-container", body);
  updateHtml(pContainer, postContainer(allPosts, postNo.value));
  const addBtns = els(".product-container .card-footer>button");
  addBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      el("#productImagePath").click();
      btnValue = btn.value;
    });
  });
  el('#productImagePath').value='';
};

const createPostCard = function (
  cardId,
  cardName,
  cardDetails,
  cardImage = null
) {
  let cardTag = `
        <span> 450x300 </span>
        <span class="vl"></span>
      `;

  if (cardImage)
    cardTag = `
              <img src="${cardImage}" alt="${cardName}" class="h-100 w-100"></img>
          `;

  return `
      <div class="col card-item" data-aos="fade-up">
          <div class="card h-100">
            <div class="card-div fs-1">
              <span class="vl badge text-bg-dark sale d-none">Sale</span>
              ${cardTag}
            </div>
            <div class="card-body">
              <h5 class="card-title fw-bold product-name">${cardName}</h5>
              <p class="card-text">$${cardDetails}</p>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-outline-dark" value="${cardId}">
                Select Photo
              </button>
            </div>
          </div>
      </div>
  `;
};

const postContainer = (allProd, selectedNo = 10) => {
  let allPCards = "";
  let i = 0;
  allProd.forEach((prod) => {
    if (i < selectedNo) {
      allPCards += createPostCard(prod.id, prod.title, prod.body, prod.photo);
    }
    i++;
  });

  el("#fetchApi").innerHTML = "Reload";
  if (!allPCards) {
    el("#fetchApi").innerHTML = "Api Fetch";
    return `
              <div class="h2 my-5 text-center text-danger">No Posts Found!</div>
          `;
  }

  return `
      <div class="container text-center mb-5 mt-5 product-container">
          <div class="row row-cols-1 row-cols-md-4 g-4">
              ${allPCards}
          </div>
      </div>
      `;
};

export { fetchPosts, getPosts, renderPosts, btnValue };
