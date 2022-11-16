import { connectionInstance } from "../shared_middleware.js";
import { secret_key } from "../shared_middleware.js";

$(window).on("load", async () => {
  var isLogin = localStorage.getItem("sessionToken");
  if (isLogin) {
    $("#loggedin").show();
  } else {
    $("#nologin").show();
    window.location.replace("/");
  }
  $("#noItem").hide();

  const url_splitted_array = window.location.href.split("/");
  const itemId = url_splitted_array[url_splitted_array.length - 1];

  if (itemId != "cart") {
    await connectionInstance
      .delete("api/cart/" + itemId)
      .then(function (res) {})
      .catch(function (err) {});
  }

  await connectionInstance
    .get("api/cart/")
    .then(function (res) {
      const user_cart = res.data.data;
      if (user_cart.length > 0) {
        $("#noItem").html("");

        let cartArr = [];
        for (let i in user_cart) {
          let item = {
            id: user_cart[i].id,
            prodName: user_cart[i].product.name,
            subtotal: user_cart[i].subtotal,
            quantity: user_cart[i].quantity,
            imgUrl: user_cart[i].product.image_url,
          };
          cartArr.push(item);
        }
        generate_items(cartArr);
      } else {
        $("#totalAmt").empty();
        $("#noItem").html("No item in your cart.");
      }
    })
    .catch(async function (err) {
      if (err.response.data.message == "Session Expired") {
        await connectionInstance
          .post("api/refreshToken")
          .then(function (res) {})
          .catch(function (err) {});
      }
    });

  $("#clearAll").on("click", async function () {
    await connectionInstance
      .delete("api/cart/")
      .then(function (res) {
        window.location.reload();
      })
      .catch(async function (err) {});
  });
});

function generate_items(arr) {
  var totalamount = 0;
  for (let i = 0; i < arr.length; ++i) {
    $("#tableBody").append(`<tr>
                                <td>
                                    <div class="product-item">
                                        <a class="product-thumb" href="#"><img
                                                src="${arr[i].imgUrl}"
                                                alt="Product"></a>
                                        <div class="product-info">
                                            <h3 class="product-title">Name: ${arr[i].prodName}</h3>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-center text-lg text-medium">${arr[i].quantity}</td>
                                <td class="text-center text-lg text-medium">${arr[i].subtotal}</td>
                                <td class="text-center">—</td>
                                
                            </tr>`);
    totalamount = parseFloat(totalamount) + parseFloat(arr[i].subtotal);
  }
  $("#totalAmt").empty();
  $("#totalAmt").append(`
        <h4>
          Total: <span class="text-medium">$${totalamount}</span>
        </h4>
      `);
}
