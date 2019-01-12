$(function () {
  var initTop = 0

  // main of scroll
  function scrollHandler (_) {
    var currentTop = $(window).scrollTop()
    if (!isMobile()) {
      // percentage inspired by hexo-theme-next
      scrollPercent(currentTop)
      // head position
      findHeadPosition(currentTop + window.innerHeight / 4)
    }
    var isUp = scrollDirection(currentTop)
    if (currentTop > 56) {
      if (isUp == $('#page-header').hasClass('visible')) {
        $('#page-header').toggleClass('visible')
      }
      $('#page-header').addClass('fixed')
      $('#go-up').addClass('shown')
    } else {
      if (currentTop === 0) {
        $('#page-header').removeClass('fixed').removeClass('visible')
      }
      $('#go-up').removeClass('shown')
    }
    // Switch between table of contents and site map
    if (currentTop > $('#content-outer').height() - window.innerHeight) {
      $('.sidebar-toc').addClass('out')
      $('.author-info').addClass('in')
    } else {
      $('.sidebar-toc').removeClass('out')
      $('.author-info').removeClass('in')
    }
  }

  $(window).scroll(scrollHandler)

  // go up smooth scroll
  $('#go-up').on('click', function () {
    $('body').velocity('stop').velocity('scroll', {
      duration: 500,
      easing: 'easeOutQuart'
    })
  })

  // head scroll
  $('a[href^="#"]').on('click', function (e) {
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
    var offset = winHeight / 4
    winHeight -= offset
    var contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : ($(document).height() - winHeight)
    var scrollPercent = Math.min(1, Math.max(0, ((currentTop + offset) - refElm.offset().top) / (contentMath)))
    var percentage = Math.round(scrollPercent * 100)
    var percentagePrec = Math.round(scrollPercent * 10000) / 100
    $('.progress-num').text(percentage)
    $('.sidebar-toc__progress-bar').css('width', percentagePrec + '%')
  }

  // scroll to a head(anchor)
  function scrollToHead (anchor) {
    $(anchor).velocity('stop').velocity('scroll', {
      duration: 500,
      easing: 'easeInOutQuad',
      offset: -window.innerHeight / 4,
      complete: function (elements) {
        var anchor = $(elements[0])
        anchor.addClass('anchor-highlight')
        setTimeout((function (_anchor) { return function () {
          _anchor.removeClass('anchor-highlight')
        } })(anchor), 1000)
      }
    })
  }

  // Precalculate element height for later transitions
  $(document).ready(function () {
    var ls = $('.toc-child')
    ls.each(function (idx) {
      var el = ls.eq(idx)
      el.css('max-height', el.height() + 'px')
    })
    ls.addClass('hidden')

    scrollHandler()
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
