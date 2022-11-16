import { connectionInstance } from "../shared_middleware.js";
import { secret_key } from "../shared_middleware.js";

$(window).on("load", async () => {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    window.location.replace("/login");
  }

  const tk = localStorage.getItem("sessionToken");
  let myKey = secret_key;
  const url_splitted_array = window.location.href.split("/");
  const itemId = DOMPurify.sanitize(
    url_splitted_array[url_splitted_array.length - 1]
  );

  if (itemId !== "products" && itemId !== "admin") {
    let myKey = secret_key;
    const id = CryptoJS.AES.decrypt(decodeURIComponent(itemId), myKey).toString(
      CryptoJS.enc.Utf8
    );

    if (confirm("Are you sure you want to delete this item?")) {
      const res = await connectionInstance
        .delete("api/products/" + id)
        .then(function (response) {
          Window.location.replace("/admin/products");
        })
        .catch(function (error) {});
    } else {
      location.href = "/admin/products";
    }
  }
  await connectionInstance
    .get("api/products/")
    .then(function (response) {
      const products_list = response;
      let prodArray = [];
      for (let i in products_list.data) {
        let item = {
          id: products_list.data[i].id,
          prodName: products_list.data[i].name,
          price: products_list.data[i].price,
          imgUrl: products_list.data[i].image_url,
          stock: products_list.data[i].stock,
          description: products_list.data[i].description,
          product_code: products_list.data[i].product_code,
          cat: products_list.data[i].category.category_name,
        };
        prodArray.push(item);
      }

      generate_items(prodArray, myKey);
    })
    .catch(function (error) {});
});

function generate_items(arr, key) {
  for (let i = 0; i < arr.length; ++i) {
    var id_encrypted = encodeURIComponent(CryptoJS.AES.encrypt(arr[i].id, key));
    $("#item").append(`
              <div class="col">
                  <div class="card border shadow-none mb-0 h-100 ">
                    <div class="card-body text-center card-body1">
                      <img
                        src="${arr[i].imgUrl}"
                        class="img-thumbnail mb-3 w-auto"
                        style="height: 30vh; width:40vh"
                        alt=""
                      />
                      <h6 class="product-title">${arr[i].prodName}</h6>
                      <p class="product-price fs-5 mb-1">
                        <span>$S${arr[i].price}</span>
                      </p>
                      <div
                        class="actions d-flex align-items-center justify-content-center gap-2 mt-auto"
                      >
                        <a
                          href="/admin/editProduct/${id_encrypted}"
                          class="btn btn-sm btn-outline-primary"
                          ><i class="bi bi-pencil-fill"></i> Edit</a
                        >
                        <a
                          href="/admin/products/${id_encrypted}"
                          class="btn btn-sm btn-outline-danger"
                          ><i class="bi bi-trash-fill"></i> Delete</a
                        >
                      </div>
                    </div>
                  </div>
                </div>`);
  }
}
