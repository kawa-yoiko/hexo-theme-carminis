$(function () {
  $('.toggle-sidebar-info > span').on('click', function () {
    var toggleText = $(this).attr('data-toggle')
    $(this).attr('data-toggle', $(this).text())
    $(this).text(toggleText)
    changeSideBarInfo()
  })
  $('#toggle-sidebar').on('click', function () {
    if (!isMobile() && $('#sidebar').is(':visible')) {
      $(this).toggleClass('on')
      $('#page-header').toggleClass('open-sidebar')
      $('body').toggleClass('sidebar-shown')
    }
  })
  function changeSideBarInfo() {
    if ($('.author-info').is(':visible')) {
      $('.author-info').velocity('stop')
        .velocity('transition.slideLeftOut', {
          duration: 300,
          complete: function () {
            $('.sidebar-toc').velocity('stop')
              .velocity('transition.slideRightIn', { duration: 500 })
          }
        })
    } else {
      $('.sidebar-toc').velocity('stop')
        .velocity('transition.slideRightOut', {
          duration: 300,
          complete: function () {
            $('.author-info').velocity('stop')
              .velocity('transition.slideLeftIn', { duration: 500 })
          }
        })
    }
  }
})
