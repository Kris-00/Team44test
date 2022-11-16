import { connectionInstance } from "../shared_middleware.js";
import {
  validateInputName,
  validateInputEmailPassword,
} from "../shared_middleware.js";

$(window).on("load", async function () {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    window.location.replace("/login");
  }
});

const name = localStorage.getItem("name");

$("#userName").html(`${name}`);

$("#crtAcc").click(async () => {
  let e = $("#email").val();
  let no = $("#phone").val();
  let fn = $("#fName").val();
  let ln = $("#lName").val();
  let pwd = $("#password").val();
  let cfmPwd = $("#cfmPassword").val();
  let activate = $("#activate:checked").prop("checked");

  var name = validateInputName(fn);
  var lname = validateInputName(ln);
  var val = validateInputEmailPassword(e, pwd);

  if (name && lname && val) {
    await connectionInstance
      .post(
        "api/admin/create",

        {
          full_name: fn + " " + ln,
          email: e,
          password: pwd,
          phone: no,
          isActivate: activate,
        }
      )
      .then(function (response) {
        window.location.replace("/admin/accounts");
      })
      .catch(function (error) {
        $("#errMsg").html("Fields cannot be empty");
      });
  } else {
    $("#errMsg").html("Fields cannot be empty");
  }
});
