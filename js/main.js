$(document).ready(function() {
  $("#comment-img").click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#fb-comments").offset().top - 100
    }, 1500, 'easeOutQuart');
  });
});
