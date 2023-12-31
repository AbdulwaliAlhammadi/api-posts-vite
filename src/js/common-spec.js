import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const errorCodes = {
  QUOTA_EXCEEDED_ERR: 22,
  QUOTA_EXCEEDED_ERR2: 1014,
};

// JsDocs
/**
 * Retrieves the first element that matches the specified selector.
 *
 * @param {string} element - The CSS selector of the element to retrieve.
 * @returns {Element|null} The first element that matches the selector, or null if no element is found.
 */
const el = (element, parentElement = document) =>
  parentElement.querySelector(element);

/**
 * Retrieves a list of elements that match the specified selector.
 *
 * @param {string} elements - The CSS selector of the elements to retrieve.
 * @returns {NodeList} A list of elements that match the selector.
 */
const els = (elements, parentElement = document) =>
  parentElement.querySelectorAll(elements);

const renderHtml = (element, htmlString) => {
  element.innerHTML += htmlString;
};

const updateHtml = (element, htmlString) => {
  element.innerHTML = htmlString;
};

const tryCatch = (callbackFunction) => {
  try {
    callbackFunction();
  } catch (error) {
    console.log("error code: ", error.code, "error message: ", error);
  } finally {
    // console.log("finally");
  }
};

const setStorage = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          data: value,
        })
      );
      resolve("Ok");
    } catch {
      reject("Failed");
    }
  });
};

const getStorage = (key, initalValue = null) => {
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data).data;
  return initalValue;
};

const product = (() => {
  const productList = getStorage("products") ?? [];
  const productOperations = {
    addNewProduct: (
      productName,
      productDetails,
      productPrice = 0,
      productPhoto,
      eventHandler
    ) => {
      if (
        !productPhoto.startsWith("data:image/png") &&
        !productPhoto.startsWith("data:image/jpeg") &&
        !productPhoto.startsWith("data:image/jpg")
      )
        productPhoto = null;

      if (!(productName && productDetails && productPrice)) {
        eventHandler.preventDefault();
        throw "Fields must me filled";
      }

      let Product = {
        id: productList.length + 1,
        name: productName,
        details: productDetails,
        price: productPrice,
        photo: productPhoto,
      };

      productList.push(Product);
      setStorage("products", productList);
    },
    getAllProducts: () => {
      return productList;
    },
    getTotalPrice: () => {
      let totalPrice = 0;
      productList.forEach((product) => {
        totalPrice += product.price;
      });
      return totalPrice;
    },
    getProductsByName: (productName) => {
      const regex = new RegExp(productName, "i");
      return productList.filter((product) => product.name.search(regex) >= 0);
    },
  };
  return productOperations;
})();

const cart = (() => {
  let cartProducts = getStorage("cartProducts") ?? [];
  const cartOperations = {
    add: (productId, productCnt = 1, productRate = 0) => {
      cartProducts.push({ pid: productId, pCnt: productCnt });
      setStorage("cartProducts", cartProducts);
    },
    getAllCartProducts: () => {
      return cartProducts;
    },
    getCount: () => {
      return cartProducts.length;
    },
    getCartProductsById: (productId) => {
      const regex = new RegExp(productId, "i");
      return cartProducts.filter((cartProduct) => cartProduct.pid == productId);
    },
  };
  return cartOperations;
})();

const loadImage = (event, imgElementPara) => {
  return new Promise((resolve, reject) => {
    var file = event.target.files[0]; // Get the selected file

    // Check if a file is selected
    if (file) {
      var allowedTypes = ["image/jpeg", "image/png"];
      var fileType = file.type;

      if (allowedTypes.includes(fileType)) {
        var reader = new FileReader(); // Create a FileReader object
        reader.readAsDataURL(file); // Read the selected file as a Data URL
        // Set up the FileReader onload event
        reader.onload = function () {
          var imgElement = imgElementPara;
          imgElement.src = reader.result; // Set the src attribute of the img tag to the selected image
          resolve(reader.result);
        };
      } else {
        prevImage.setAttribute("src", "#");
        reader.onerror = (error) => reject(error);
      }
    }
  });
};

const showAlert = (type, message) => {
  const alertTypes = [
    "alert-primary",
    "alert-success",
    "alert-warning",
    "alert-danger",
    "alert-info",
  ];
  const alertDiv = `
  <div class="alert alert-dismissible ${alertTypes[type]} container fade show sticky-top" role="alert">
      ${message}
      <button id="alertClose" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `;

  const clickHandler = () => {
    alertClose.click();
  };

  const mainEl = el("main");

  mainEl.insertAdjacentHTML("beforebegin", alertDiv);
  const alertClose = el("#alertClose");

  mainEl.classList.add("opacity-50", "cursor-pointer");
  mainEl.classList.remove("vh-100");
  mainEl.addEventListener("click", clickHandler);

  alertClose.addEventListener("click", () => {
    mainEl.classList.remove("opacity-50", "cursor-pointer");
    mainEl.classList.add("vh-100");
    mainEl.removeEventListener("click", clickHandler);
  });

  setTimeout(() => {
    alertClose.click();
  }, 5000);
};

const showToast = (type, message) => {
  const bgColors = [
    "linear-gradient(to right, #007bff, #6c757d)",
    "linear-gradient(to right, #28a745, #6c757d)",
    "linear-gradient(to right, #ffc107, #6c757d)",
    "linear-gradient(to right, #dc3545, #6c757d)",
    "linear-gradient(to right, #17a2b8, #6c757d)",
  ];

  Toastify({
    text: message,
    duration: 5000,
    close: true,
    gravity: "top",
    position: "center",
    style: {
      background: bgColors[type],
    },
  }).showToast();
};

export {
  el,
  els,
  tryCatch,
  setStorage,
  getStorage,
  renderHtml,
  updateHtml,
  loadImage,
  showAlert,
  showToast,
};
