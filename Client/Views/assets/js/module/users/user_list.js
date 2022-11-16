import { connectionInstance } from "../shared_middleware.js";

$(window).on("load", async () => {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    window.location.replace("/login");
  }

  await connectionInstance
    .get("api/users/", {
      params: {
        id: "8d5e3d17-cf19-4a1b-87b8-4671b13a55f4",
        role: "admin",
      },
    })
    .then(function (response) {
      const users_list = response;
      let user_Array = [];
      for (let i in users_list.data) {
        let item = {
          id: users_list.data[i].id,
          name: users_list.data[i].full_name,
          email: users_list.data[i].email,
          phone: users_list.data[i].phone,
          status: users_list.data[i].account_status,
          role: users_list.data[i].user_role,
          createAt: users_list.data[i].created_at,
        };
        user_Array.push(item);
      }

      generate_items(user_Array);
    })
    .catch(function (error) {});
});

function generate_items(arr) {
  for (let i = 0; i < arr.length; ++i) {
    let classAtt = "alert-danger";
    if (arr[i].status === "unlocked") {
      classAtt = "alert-success";
    }
    let d = moment(arr[i].createAt).format("L");
    $("#tableBody").append(`
              <tr>
                        <td>#${i.toString().padStart(5, "0")}</td>
                        <td>${arr[i].name}</td>
                        <td>${arr[i].email}</td>
                        <td>
                          <span class="badge rounded-pill ${classAtt}"
                            >${arr[i].status}</span
                          >
                        </td>
                        <td>${d}</td>
                      </tr>`);
  }
}
