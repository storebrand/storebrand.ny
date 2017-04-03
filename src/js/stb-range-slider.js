/**
 * Created by ksawery on 03/04/17.
 */
$(document).ready(function() {
  var slidermin = 0;
  var slidermax = 100;
  var sliderSelector = '#stb-slider';
  var sliderTextSelector = '#stb-slider-text';

  var slider = $(sliderSelector);
  var sliderText = $(sliderTextSelector);

  slider.attr('min',slidermin);
  slider.attr('max',slidermax);

  slider.on("ready load change mousemove", function() {
    var value = $(this).val();

    if(value<slidermin){
      $(this).val(slidermin);
    }
    if(value> slidermax){
      $(this).val(slidermax);
    }

    sliderText.val($(this).val());
  });

  $(sliderTextSelector).on("change click mouseup", function(event) {
    var age = $(this).val();
    if(age<slidermin){
      $(this).val(slidermin);
    }
    if(age> slidermax){
      $(this).val(slidermax);
    }
    slider.val( $(sliderTextSelector).val());
  });
});
