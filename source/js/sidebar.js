$(function () {
  $('#toggle-sidebar').on('click', function () {
    if (!isMobile() && $('#sidebar').is(':visible')) {
      $(this).toggleClass('on')
      $('#page-header').toggleClass('open-sidebar')
      $('body').toggleClass('sidebar-shown')
    }
  })
})
