$(window).on("load", async function () {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    window.location.replace("/login");
  }
});
