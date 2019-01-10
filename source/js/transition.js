$(function () {
  // page
  $('.layout').velocity('stop')
    .velocity('transition.slideUpIn', {
      delay: 0,
      duration: 700,
      easing: 'easeInOutQuart',
      complete: function () {
        if ($('.sidebar-toc').length > 0) {
          $('#toggle-sidebar').click()
        }
      }
    })
  $('#top-container').velocity('stop')
    .velocity('transition.fadeIn', {
      delay: 200,
      duration: 500,
      easing: 'easeInOutQuart'
    })
})
