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

$(document).ready(function(){
  if($('.datePicker').length > 0){
    $('.datePicker').datetimepicker(
        {language: 'nb',
          pickTime: false,
          icons: {
            date: 'stb-sprite-small white calendar'
          }
        }
    );
    $('.datePicker')
        .on('dp.change dp.show', function(e) {
          var name = $(e.target).find('input').attr('name');
          // Validate the date when user change it
          if($(this).parents('form.validateForm').length > 0){
            $(this).parents('form.validateForm')
              // Get the bootstrapValidator instance
                .data('bootstrapValidator')
              // Mark the field as not validated, so it'll be re-validated when the user change date
                .updateStatus(name, 'NOT_VALIDATED', null)
              // Validate the field
                .validateField(name);
          }
        });
  }
});



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

function acceptCookies(){
  createCookie('acceptCookies','Yes', '90');
  $('#cookieNote').hide('slow');
}

/* ***** Date validator for boootstrap validator and datetimepicker ***** */
var dateValidator = {
  message: '<span class="glyphicon glyphicon-exclamation-sign"></span> Verdien er ikke en gyldig dato.',
  callback: function(value,validator){
    var m = new moment(value, 'DD.MM.YYYY', true);
    return m.isValid();
  }
};
/* ***** End of date validator for boootstrap validator and datetimepicker ***** */
/* ***** Function for intitiating a slider with a input element on the side ***** */
function initiateSlider(sliderEl, sliderObj, unit, name){

  var sliderInput = '<input id="'+name+'" type="number" class="text-center sliderInput" name="'+name+'"/>';
  sliderEl.parent().prepend(sliderInput+'<p class="unit">'+unit+'</p>');
  sliderEl.slider(sliderObj);

  $('#'+name).on('change',function(){
    sliderEl.slider('value', $(this).val());
  });
}
/* ***** End of slider function ***** */