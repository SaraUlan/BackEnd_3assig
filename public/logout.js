$(document).ready(function () {
  $("#logoutbutton").on("click", function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/api/logout",
      success: function (response) {
        console.log("Logout successful");
        console.log(response);
      },
      error: function (xhr, status, error) {
        console.error("Error occurred while signing up");
        console.error(xhr.responseText);
      },
    });
  });
});
