import { connectionInstance } from "../shared_middleware.js";

$(window).on("load", async function () {
  var isHave = localStorage.getItem("sessionToken");

  if (isHave) {
    $("#loggedin").show();
  } else {
    $("#nologin").show();
  }

  const products = async () => {
    try {
      const res = await connectionInstance.get("api/productsList/");
      return res;
    } catch (ex) {
      return ex.response;
    }
  };

  const products_list = await products();
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
      cat: products_list.data[i].category.name,
      catId: products_list.data[i].categoryId,
    };
    prodArray.push(item);
  }

  await generate_items(prodArray);

  $(".buttn").click(async function () {
    const prod_id = $(this).attr("id");
    await connectionInstance
      .post("api/carts/" + prod_id)
      .then(function (res) {
        alert("Added to cart!");
      })
      .catch(async function (err) {
        if (err.response.data.message == "Session Expired") {
          await connectionInstance
            .post("api/refreshToken")
            .then(function (res) {})
            .catch(function (err) {});
        }
      });
  });
});

async function generate_items(arr) {
  for (let i = 0; i < arr.length; ++i) {
    $("#item").append(`
              <div class="col">
                  <div class="card border shadow-none mb-0">
                    <div class="card-body text-center">
                      <img
                        src="${arr[i].imgUrl}"
                        class="img-thumbnail mb-3"
                        style="height: 30vh; width:40vh"
                        alt=""
                      />
                      <h6 class="product-title">${arr[i].prodName}</h6>
                      <p class="product-price fs-5 mb-1">
                        <span>$S${arr[i].price}</span>
                      </p>
                      <div id="container_btn"
                        class="actions d-flex align-items-center justify-content-center gap-2 mt-3"
                      >
                      <button id="${arr[i].id}" class="buttn" type="button" data-prodId="${arr[i].id}" >Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>`);
  }
}
