$(document).ready(function () {
  $("#signup_btn").on("click", function (event) {
    event.preventDefault();

    const username = $("#username").val();
    const email = $('#email').val();
    const password = $("#password").val();

    const data = {
      username: username,
      email : email,
      password: password,
    };

    $.ajax({
      type: "POST",
      url: "/api/signup",
      data: data,
      success: function (response) {
        $("#messages").html(response.message);
        $("#messages").addClass("alert alert-success");
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
