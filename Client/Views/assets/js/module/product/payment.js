import { connectionInstance, validateInputName } from "../shared_middleware.js";
import { secret_key } from "../shared_middleware.js";
import { validateCard, checkSupported } from "../shared_middleware.js";

$(window).on("load", async () => {
  var isLogin = localStorage.getItem("sessionToken");
  if (isLogin) {
    $("#loggedin").show();
    window.location.replace("/");
  } else {
    $("#nologin").show();
  }
  await connectionInstance
    .get("api/cart/checkout/")
    .then(function (res) {
      let stotal = 0.0;
      let fees = 15.0;
      var result = res.data.data;
      for (var i in result) {
        stotal = stotal + parseFloat(result[i]);
      }
      $("#subtotal").empty();
      $("#subtotal").append(`<span>Subtotal</span> <span>$${stotal}</span>`);
      $("#fees").empty();
      $("#fees").append(`<span>Subtotal</span> <span>$${fees}</span>`);
      $("#Total").empty();
      $("#Total").append(
        `<span>Subtotal</span> <span>$${stotal + fees}</span>`
      );
    })
    .catch(function (err) {});
});

$("#cardNo").on("input", function () {
  if (checkSupported($("#cardNo").val())) {
    $("#status").attr("hidden", false);
    $("#status").html("valid card");
    $("#placeOrder").attr("disabled", false);
  } else {
    $("#status").attr("hidden", false);
    $("#status").html("invalid card");
    $("#placeOrder").attr("disabled", true);
  }
});

$("#cardNo").attr("maxlength", 16);
$("#cvv").attr("maxlength", 4);

$("#placeOrder").on("click", async function () {
  const name = $("#cname").val();
  let val = validateInputName(name);
  if (val && $("#dte").val() != "" && $("#cvv").val() != "") {
    await connectionInstance
      .post("api/cart/checkout/")
      .then(function (res) {
        alert("Payment succesful!");
        window.location.replace("http://localhost:5000/");
      })
      .catch(function (err) {});
  } else {
    $("#status").html("Fields cannot be empty!");
  }
});
