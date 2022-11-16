import {
  validateInputEmailPassword,
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

  $("#icon").attr("hidden", true);
  $("#verifySpint").attr("hidden", true);
});

$("#signin").click(async () => {
  let e = $("#inputEmailAddress").val();
  let p = $("#inputPassword").val();
  let val = validateInputEmailPassword(e, p);
  if (val) {
    $("#signin").prop("disabled", true);
    $("#signin").append(`<i class="fa fa-spinner fa-spin" id="icon"></i>`);
    const res = await connectionInstance
      .post(
        "api/login/",
        {
          email: e,
          password: p,
        },
        { withCredentials: true }
      )
      .then(function (res) {
        $("#login-card").attr("hidden", true);
        $("#otp-card").attr("hidden", false);
        $("#successMsg").text("The OTP have been sent to your email.");
      })
      .catch(function (error) {
        if (error.response.status == 400) {
          $("#inputEmailAddress").val("");
          $("#inputPassword").val("");
          $("#errorMsg").text(error.response.data.message);
          $("#signin").prop("disabled", false);
          $("#icon").attr("hidden", true);
        }
      });
  } else {
    $("#errorMsg").text("Invalid email or Password. Please try again.");
  }
});

$("#verify").click(async () => {
  let otp = $("#inputOTP").val();
  $("#verify").prop("disabled", true);
  $("#verify").append(`<i class="fa fa-spinner fa-spin" id="verifySpint"></i>`);
  await connectionInstance
    .post(
      "api/verifyOTP/",
      {
        otp: otp,
      },
      { withCredentials: true }
    )
    .then(function (res) {
      localStorage.setItem("sessionToken", res.data.data.accessToken);
      localStorage.setItem("role", res.data.data.role);
      localStorage.setItem("name", res.data.data.name);
      const role = res.data.data.role;
      if (role === "admin") {
        window.location.replace("/admin");
      } else {
        window.location.replace("/");
      }
    })
    .catch(function (error) {
      if (error.response.status == 400) {
        $("#successMsg").attr("hidden", true);
        $("#errorMsgOTP").text(error.response.data.message);
        $("#verify").prop("disabled", false);
        $("#verifySpint").attr("hidden", true);
      }
    });
});
