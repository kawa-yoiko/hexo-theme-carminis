$(function () {
  var initTop = 0

  sidebarDispTOC = function () {
    if ($('.sidebar-toc').is(':visible')) {
      return;
    }
    $('.author-info').velocity('stop')
      .velocity('transition.slideLeftOut', {
        duration: 300,
        complete: function () {
          $('.sidebar-toc').velocity('stop')
            .velocity('transition.slideRightIn', { duration: 500 })
        }
      })
  }

  sidebarDispSitemap = function () {
    if ($('.author-info').is(':visible')) {
      return;
    }
    $('.sidebar-toc').velocity('stop')
      .velocity('transition.slideRightOut', {
        duration: 300,
        complete: function () {
          $('.author-info').velocity('stop')
            .velocity('transition.slideLeftIn', { duration: 500 })
        }
      })
  }

  // main of scroll
  $(window).scroll(throttle(function (event) {
    var currentTop = $(this).scrollTop()
    if (!isMobile()) {
      // percentage inspired by hexo-theme-next
      scrollPercent(currentTop)
      // head position
      findHeadPosition(currentTop + window.innerHeight / 3)
    }
    var isUp = scrollDirection(currentTop)
    if (currentTop > 56) {
      if (isUp) {
        $('#page-header').hasClass('visible') ? $('#page-header').removeClass('visible') : console.log()
      } else {
        $('#page-header').hasClass('visible') ? console.log() : $('#page-header').addClass('visible')
      }
      $('#page-header').addClass('fixed')
      if ($('#go-up').css('opacity') === '0') {
        $('#go-up').velocity('stop').velocity({
          translateX: -30,
          rotateZ: 360,
          opacity: 1
        }, {
          easing: 'easeOutQuart',
          duration: 200
        })
      }
    } else {
      if (currentTop === 0) {
        $('#page-header').removeClass('fixed').removeClass('visible')
      }
      $('#go-up').velocity('stop').velocity({
        translateX: 0,
        rotateZ: 180,
        opacity: 0
      }, {
        easing: 'linear',
        duration: 200
      })
    }
    // Switch between table of contents and site map
    if (currentTop > $('#content-outer').height() - window.innerHeight) {
      sidebarDispSitemap();
    } else {
      sidebarDispTOC();
    }
  }, 50, 100))

  // go up smooth scroll
  $('#go-up').on('click', function () {
    $('body').velocity('stop').velocity('scroll', {
      duration: 500,
      easing: 'easeOutQuart'
    })
  })

  // head scroll
  $('#post-content').find('h1,h2,h3,h4,h5,h6').on('click', function (e) {
    scrollToHead('#' + $(this).attr('id'))
  })

  // head scroll
  $('.toc-link').on('click', function (e) {
    e.preventDefault()
    scrollToHead($(this).attr('href'))
  })

  // find the scroll direction
  function scrollDirection (currentTop) {
    var result = currentTop > initTop // true is down & false is up
    initTop = currentTop
    return result
  }

  function scrollPercent (currentTop) {
    var refElm = $('#post')
    var docHeight = refElm.height()
    var winHeight = $(window).height()
    var contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : ($(document).height() - winHeight)
    var scrollPercent = (currentTop - refElm.offset().top) / (contentMath)
    var scrollPercentRounded = Math.round(scrollPercent * 100)
    var percentage = Math.min(100, Math.max(0, scrollPercentRounded))
    $('.progress-num').text(percentage)
    $('.sidebar-toc__progress-bar').velocity('stop')
      .velocity({
        width: percentage + '%'
      }, {
        duration: 100,
        easing: 'easeInOutQuart'
      })
  }

  function updateAnchor (anchor) {
    if (window.history.replaceState && anchor !== window.location.hash) {
      window.history.replaceState(undefined, undefined, anchor)
    }
  }

  // Precalculate element height for later transitions
  $(document).ready(function () {
    var ls = $('.toc-child')
    ls.each(function (id) {
      var el = ls.eq(id)
      el.css('max-height', el.height() + 'px')
    })
    ls.addClass('hidden')
  })

  // find head position & add active class

  // DOM Hierarchy:
  // ol.toc > (li.toc-item, ...)
  // li.toc-item > (a.toc-link, ol.toc-child > (li.toc-item, ...))

  // In this implementation we manipulate **the list of subsections** only,
  // i.e. the outermost .toc-child containers that exist

  var activeLink = null
  var activeChildElm = null // Outermost only

  function findHeadPosition (top) {
    // assume that we are not in the post page if no TOC link be found,
    // thus no need to update the status
    if ($('.toc-link').length === 0) {
      return false
    }

    var list = $('#post-content').find('h1,h2,h3,h4,h5,h6')
    var currentId = ''
    list.each(function () {
      var head = $(this)
      if (top > head.offset().top - 25) {
        currentId = '#' + $(this).attr('id')
      }
    })

    if (currentId === '' && activeLink != null) {
      activeLink.removeClass('active')
      activeChildElm.addClass('hidden')
      activeLink = null
      activeChildElm = null
    }

    if (currentId && (!activeLink || activeLink.attr('href') !== currentId)) {
      updateAnchor(currentId)

      if (activeLink != null) {
        activeLink.removeClass('active')
        activeChildElm.addClass('hidden')
      }

      var _this = $('.toc-link[href="' + currentId + '"]')
      _this.addClass('active')
      activeLink = _this

      var parents = _this.parents('.toc-child')
      // Returned list is in reverse order of the DOM elements
      // Thus `parents.last()` is the outermost .toc-child container
      var topLink = (parents.length > 0) ? parents.last() : _this
      activeChildElm = topLink.closest('.toc-item').find('.toc-child')
      activeChildElm.removeClass('hidden')
    }
  }
})
