import {
  validateInputNameEmailPasswordPhone,
  connectionInstance,
} from "../shared_middleware.js";

$(window).on("load", async function () {
  var isLogin = localStorage.getItem("sessionToken");
  if (isLogin) {
    $("#loggedin").show();
    window.location.replace("/");
  } else {
    $("#nologin").show();
  }
});

$("#signup").click(async () => {
  let e = $("#inputEmailAddress").val();
  let n = $("#inputName").val();
  let p = $("#inputChoosePassword").val();
  let no = $("#inputPhoneNumber").val();

  let val = validateInputNameEmailPasswordPhone(n, e, p, no);
  if (val) {
    const res = await connectionInstance
      .post("api/register/", {
        full_name: n,
        email: e,
        password: p,
        phone: no,
      })
      .then(function (response) {
        window.location.replace("/login");
      })
      .catch(function (error) {
        if (error.response.status == 400) {
          $("#errorMsg").text(error.response.data.message);
        }
      });
  } else {
    $("#errorMsg").html("Fields cannot be empty.");
  }
});
