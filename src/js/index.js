import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./common-spec.js";
import "../css/spinner.css";
import "../css/style.css";
import "./common.js";

import {
  el,
  setStorage,
  renderHtml,
  loadImage,
  showToast,
} from "./common-spec.js";
import {
  fetchPosts,
  getPosts,
  renderPosts,
  btnValue,
} from "./posts-functions.js";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

const bodyTitle = `
    <section>
      <div class="p-5 mb-2 bg-dark text-white text-center">
        <div class="d-flex justify-content-center">
          <div id="myClass" class="input-group w-50">
            <label class="d-md-flex d-none input-group-text" for="inputGroupSelect01">Show:</label>
            <select id="postNo" class="form-select" id="inputGroupSelect01">
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
            </select>
            <button id="fetchApi" type="button" class="btn btn-light">
              Reload
            </button>
          </div>
        </div>
      </div>
      <div>
        <input type="file" class="form-control d-none" id="productImagePath" placeholder="Product Image Path" accept="image/jpeg, image/png" />
        <label class="d-none" for="productImagePath">Product Image Path</label>
        <img id="previewProductImage" src="#" alt="Preview Product Image" class="d-none"  />
      </div>
    </section>
`;

renderHtml(body, bodyTitle);
renderHtml(body, '<div id="post-container"></div>');

renderPosts();

el("#fetchApi").addEventListener("click", (event) => {
  fetchPosts();
});

el("#postNo").addEventListener("change", () => {
  renderPosts();
});

el("#productImagePath").addEventListener("change", async (event) => {
  const allPosts = getPosts("posts");
  const index = allPosts.findIndex((obj) => obj.id == btnValue);
  if (index !== -1) {
    let prevImage = el("#previewProductImage");
    allPosts[index].photo = await loadImage(event, prevImage);
    allPosts.splice(index, 1, allPosts[index]);
    setStorage("posts", allPosts)
      .then(() => {
        renderPosts();
        showToast(1, "Photo Uploaded successfully!");
      })
      .catch(() => showToast(3, "Failed! LocalStorage has exceeded the maximum size.")
      );
  }
});
