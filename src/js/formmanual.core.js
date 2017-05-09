/**
 *   Various code to allow the web manual to show some demos
 */

// Take a hash as input and scroll smoothly to the related target element
function scrollToHash(hash) {
  var target = $(hash);
  target = target.length ? target : $('[name=' + hash.slice(1) +']');
  if (target.length) {
    scrollToPosition = target.offset().top;
    // Checking if the navigation header is fixed. If yes, set the scrollto position by subtracting the height of the fixed header
    if($('.navbar-fixed-top').css("display") == "block") {
      scrollToPosition -= $('.navbar-fixed-top').height();
    }
    $('html,body').animate({ scrollTop: scrollToPosition }, 1000);
    // Highlighting the clicked heading for a brief period to make it easier to see what just happened.
    $(target).animate({backgroundColor:"#fff0f0"},1000);
    $(target).animate({backgroundColor:"#fff"},1000);
  }
}

function hexc(a) {
  var b = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  delete b[0];
  for (var c = 1; 3 >= c; ++c) b[c] = parseInt(b[c], 10).toString(16), 1 == b[c].length && (b[c] = "0" + b[c]);
  return color = "#" + b.join("");
}

//Code for toogle demonstration of Notification boxes
function toggleMsg(){
  hideErrorMsg();
  hideCommonMsg();
  setTimeout(function(){
    showErrorMsg();
    showCommonMsg();
  }, 1000);
}
/*
$(document).ready(function() {
  $.datepicker.regional.no = {
    closeText: "Lukk",
    prevText: "&laquo;",
    nextText: "&raquo;",
    currentText: "I dag",
    monthNames: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
    dayNamesShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
    dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
    dayNamesMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"],
    weekHeader: "Uke",
    dateFormat: "dd.mm.yy",
    firstDay: 1,
    isRTL: !1,
    showMonthAfterYear: !1,
    yearSuffix: ""
  }, $.datepicker.setDefaults($.datepicker.regional.no), $("input[data-widget=stb-datepicker]").datepicker().children().show();
});
*/

$("document").ready(function () {
  $("#progressbar-trigger").on("click", function () {
    var a = Math.floor(101 * Math.random()) + 0;
    $(".stb-progress div[data-widget=progressExample]").css({
      width: a + "%"
    });
  }), $("#demo-popover").popover(), $("#demo-a-popover").popover(),
    $("select[data-widget=chosenSelect]").chosen(),
    function () {
    //TODO:is this used?
    if ($("select.stb-select").customSelectMenu != undefined) {
      $("select.stb-select").customSelectMenu({
        menuClass: "stb-select"
      })
    }
  }
    ,
    $("input[name=customStyleSelect]").on("change", function () {
  }), $(".color-swatch").each(function () {
    var a = $(this).css("background-color"), b = hexc(a).toUpperCase();
    $(this).append('<div class="color-code">' + b + "</div>");
  })
});

// Begin code for Web Manual Table of Contents
$("document").ready(function(){
  // Prepare the row that contains the table of contents written specifically for the web manual
  var toclist ='<div class="row"><div class="col-md-12 toc-list top-margin-20 top-padding-10 border-top-and-bottom"><p class="intro stb-font">Jump down to <span class="stb-sprite-medium chevron-up red pull-right"></span></p><ul class="items"></ul></div></div>';
  var tocHeaders= null;
  // Place the table of content where we want it to be
  $(toclist).insertAfter($('p.lead'));
  tocHeaders= $('h2.toc-header');
  // Iterate through all the top level headings
  for(var i=0; i<tocHeaders.length; i++) {
    listMade = false;
    var headingtag = tocHeaders[i];
    $(headingtag).attr('name', headingtag.textContent.replace(/\W/g, '').toLowerCase());
    // Append relevant heading text to table to contents
    $('.toc-list .items').append( prepareTocLink(headingtag, "") );
    // Find all sub-headings(h4) inside each heading(h3)
    var allh4 = $(headingtag).nextUntil('h3','h4');
    // Check if there are any h4 elements. If there are none, we should not run the code below.
    if (allh4.length == 0) continue;
    // Prepare a list mark-up for all sub-headings in the table of contents
    var h4list = '<ul style="margin-left: 20px">';
  }

  // Check if URL already has a hash and scroll to the correct heading
  if (window.location.hash.length > 0) {
    try {
      var hashId = window.location.hash;
      // If there is a matching h3 or h4 with the hash ID, scroll to it.
      if($("h3"+hashId).length > 0 || $("h4"+hashId).length > 0) {
        scrollToHash( hashId );
      }
    } catch(e) {
      // Don't do a thing!
    }
  }

  // Perform a smooth page scroll to an anchor on the same page.
  $('.toc-list .items a[href*=#]:not([href=#])').click(function(event) {
    event.preventDefault();
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      scrollToHash( this.hash);
    }
  });

  // Prepare the TOC link for a given header tag
  function prepareTocLink(headerTag, prefix) {
    // Get the header text
    var headerText = $(headerTag).text();
    // Get the header ID from its text
    $(headerTag).attr("id",prefix.replace(/ /g,"-").toLowerCase() + "--" + headerText.replace(/\-/g,'').replace(/ /g,"-").toLowerCase());
    // Generate id for the h3
    var headerId = $(headerTag).attr("id").replace(/\W/g, ''); // set the id
    // Create the link and return it
    return '<li><a href="#'+headerId+'">'+headerText+'</a></li>';
  }
});

$(document).ready( function(){
  // Use the small chevron icon in mobile view
  if( $( window ).width() <= 768){
	  $('.toc-list p span').toggleClass("stb-sprite-small stb-sprite-medium");
  }
  // hide and show articles list
  $('.toc-list p').click(function() {
    // if the media screen width is large, then don't do anything
    // the following will apply for mobile view
    $('.toc-list .items').slideToggle();
    $('.toc-list p span').toggleClass("chevron-down red chevron-up");
  });
});
// End code for Web Manual Table of Contents


$(document).ready(function(){
  if($('#validateDate').length > 0){
    $('#validateDate').bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      group: '.stb-form-group',
      fields: {
        date: {
          trigger: 'blur',
          container: '#date-message',
          message: 'Oppgi en gyldig dato',
          validators: {
            callback: dateValidator
          }
        },
        periode : {
          container: '.periode-message',
          validators: {
            notEmpty: {
              message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi periode'
            }
          }
        }
      }
    }).on('success.form.bv', function(e) {
          // Prevent form submission
          e.preventDefault();

          var $form        = $(e.target),
              validator    = $form.data('bootstrapValidator'),
              submitButton = validator.getSubmitButton();

          // Do whatever you want here ...
        });
  };

  if($('#validateRadiobuttons').length > 0){
    $('#validateRadiobuttons').bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      group: '.stb-form-group',
      fields: {
        birds : {
          container: '.bird-message',
          validators: {
            notEmpty: {
              message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi Fugler'
            }
          }
        },
      birds2 : {
        container: '.bird-message',
        validators: {
          notEmpty: {
            message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi Fugler'
          }
        }
      }
      }
    }).on('success.form.bv', function(e) {
          // Prevent form submission
          e.preventDefault();

          var $form        = $(e.target),
              validator    = $form.data('bootstrapValidator'),
              submitButton = validator.getSubmitButton();

          // Do whatever you want here ...
        });
  };

  if($('#validateCheckboxes').length > 0){
    $('#validateCheckboxes').bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      group: '.stb-form-group',
      fields: {
          checkers: {
          container: '.checker-message',
          validators: {
            notEmpty: {
              message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi en checked'
             }
            }
          },
          checkers2: {
            container: '.checker-message',
            validators: {
              notEmpty: {
                message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi en checked'
              }
            }
          }
      }
    }).on('success.form.bv', function(e) {
          // Prevent form submission
          e.preventDefault();

          var $form        = $(e.target),
              validator    = $form.data('bootstrapValidator'),
              submitButton = validator.getSubmitButton();

          // Do whatever you want here ...
        });
  };


  if($('#validateSelect').length > 0){
    $('#validateSelect').bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      group: '.stb-form-group',
      fields: {
        picknumber: {
          container: '.select-message',
          validators: {
            notEmpty: {
              message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi en select'
            }
          }
        }
      }
    }).on('success.form.bv', function(e) {
          // Prevent form submission
          e.preventDefault();

          var $form        = $(e.target),
              validator    = $form.data('bootstrapValidator'),
              submitButton = validator.getSubmitButton();

          // Do whatever you want here ...
        });
  };

  if($('#validateChosen').length > 0){
    $('#validateChosen').bootstrapValidator({
      excluded: ':disabled',
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      group: '.stb-form-group',
      fields: {
        picknumber: {
          validators: {
            notEmpty: {
              message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi en select'
            }
          }
        }
      }
    }).on('success.form.bv', function(e) {
          // Prevent form submission
          e.preventDefault();

          var $form        = $(e.target),
              validator    = $form.data('bootstrapValidator'),
              submitButton = validator.getSubmitButton();

          // Do whatever you want here ...
        });
  };
  if($('#validateInputs').length > 0){
    $('#validateInputs').bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      group: '.stb-form-group',
      fields: {
        input1: {
          container: '.input1-message',
          validators: {
            notEmpty: {
              message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi input'
            }
          }
        },
        input2: {
          container: '.input2-message',
          validators: {
            notEmpty: {
              message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi input'
            }
          }
        },
        input3: {
          container: '.input3-message',
          validators: {
            notEmpty: {
              message: '<span class="stb-color-sprite-medium warning circle"></span> Oppgi input'
            }
          }
        }
      }
    }).on('success.form.bv', function(e) {
          // Prevent form submission
          e.preventDefault();

          var $form        = $(e.target),
              validator    = $form.data('bootstrapValidator'),
              submitButton = validator.getSubmitButton();

          // Do whatever you want here ...
        });
  };
})
