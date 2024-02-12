$(document).ready(function () {
  $(".btn-update").on("click", function (event) {
    event.preventDefault();

    const articleId = $(this).val();
    const title = $(`#titled${articleId}`).val();
    const author = $(`#authord${articleId}`).val();
    const content = $(`#contentd${articleId}`).val();
    const category = $(`#categoryd${articleId}`).val();
    const cover = 'https://via.placeholder.com/800x400';
    const images = [
      'https://via.placeholder.com/800x400',
      'https://via.placeholder.com/800x400'
    ];
    const published = Date.now();

    const article = { title, author, cover, category, content, images, published };
    console.log(article);
    $.ajax({
      type: "PATCH",
      url: `/admin/article/${articleId}`,
      data: article,
      success: function (response) {
        console.log(response);
        $(`#title${articleId}`).html(response.title);
        $(`#author${articleId}`).html(response.author);
        $(`#category${articleId}`).html(category);
        $('#messages').html(`title ${response.title} updated successfully`);
      },
      error: function (error) {
        console.error("Error updating article:", error);
        $('#messages').html(response.message);
      },
    });
  });

  $('.btn-delete').on('click', function (event) {
    event.preventDefault();

    const articleId = $(this).val();
    console.log(articleId);
    $.ajax({
      type: "DELETE",
      url: `/admin/article/${articleId}`,
      success: function (response) {
        console.log(response);
        $('#messages').html(`title ${response.title} deleted successfully`);
        $(`#card${articleId}`).remove();

      },
      error: function (error) {
        console.error("Error deleting article:", error);
        $('#messages').html(response.message);
      },
    });
  })

  $('.btn-add').on('click', function (event) {
    event.preventDefault();

    const title = $('#addtitle').val();
    const author = $('#addauthor').val();
    const category = $('#addcategory').val();
    const content = $('#addcontent').val();
    const cover = 'https://via.placeholder.com/800x400';
    const images = [
      'https://via.placeholder.com/800x400',
      'https://via.placeholder.com/800x400'
    ];
    const published = Date.now();

    const article = { title, author, cover, category, content, images, published }
    $.ajax({
      type: "POST",
      url: `/admin/article/add_article`,
      data : article,
      success: function (response) {
        console.log(response);
        $('#messages').html(`title ${response.title} added successfully. Refresh page to see change!`);
        
      },
      error: function (error) {
        console.error("Error deleting article:", error);
        $('#messages').html(response.message);
      },
    });

  })

});
