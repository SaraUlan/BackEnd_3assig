$(document).ready(function () {
  $("#login_btn").on("click", function (event) {
    event.preventDefault();

    const username = $("#username").val();
    const password = $("#password").val();

    const data = {
      username: username,
      password: password,
    };

    console.log(data);
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: data,
      success: function (response) {
        console.log("login successful");
        $("#messages").html(response.message);
        $("#messages").addClass("alert alert-danger");
      },
      error: function (xhr, status, error) {
        console.error("Error occurred while signing up");
        console.error(xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        $("#messages").html(response.message);
        $("#messages").addClass("alert alert-danger");
      },
    });
  });
});
