import { connectionInstance } from "../shared_middleware.js";

$("#logout").on("click", async function () {
  await connectionInstance
    .post("api/revokeRefreshTokens/")
    .then(function (res) {
      localStorage.removeItem("sessionToken");
      window.location.replace("/");
    })
    .catch(function (error) {});
});
