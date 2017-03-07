
// Google Analytics event tagging - automated for various design elements
// To enable analytics the element needs a 'analyze' class

$(document).ready(function() {

  // Analytics for menu usage
  $("ul.dropdown-menu a,a.dropdown-toggle").bind( "click", function() {
    debugger;
    // var aLinkTekst = $(this).text().trim();
    var cloned = $(this).clone();
    cloned.find('span').remove();
    var aLinkTekst = cloned.html().trim()
    var path = window.location.pathname;
    ga('send', 'event', path , 'Klikk i meny', aLinkTekst);
  });

  // Analytics for footer menu items usage
  $("footer a").bind("click", function() {
    var footLink = $(this).html();
    if (footLink.indexOf("<span") < 1) {
      var path = window.location.pathname;
      ga('send', 'event', path , 'Klikk i bunnmeny', footLink);
    }
  });

  // Analytics for Button
  $('button.analyze').bind( "click", function() {
    var btnTxt = $(this).html();
    var path = window.location.pathname;
    ga('send', 'event', path , 'Klikk på knapp', btnTxt);
  });

  // Analytics for Mini box
  $('.mini.clickable.analyze').bind( "click", function() {
    var boxId = $(this).attr('alt');
    var path = window.location.pathname;
    ga('send', 'event', path , 'Klikk på Mini Box', boxId);
  });

  // Analytics for Big box
  $('.big.clickable.analyze').bind( "click", function() {
    var boxId = $(this).attr('alt');
    var path = window.location.pathname;
    ga('send', 'event', path , 'Klikk på Big Box ', boxId);
  });

  // Analytics for Accordion
  $('.accordion.analyze a').bind( "click", function() {
    var q = $(this).find('.question').html();
    var path = window.location.pathname;
    ga('send', 'event', path , 'Klikk i FAQ ', q);
  });

  // Analytics for List group
  $('.list-group-item.analyze').bind( "click", function() {
    var q = $(this).html();
    var qspan = q.indexOf("<span", 0);
    var q2 = q.substring(0,qspan);
    var path = window.location.pathname;
    ga('send', 'event', path , 'Klikk i List Group ', q2);
  });

  // Analytics for Radio buttons and Checkboxes
  $('label.analyze').bind( "click", function() {
    var parent = $(this).parent();
    var q = $(this).html();
    var label = $(this).parent().prev('label').length > 0 ? $(this).parent().prev('label').html() : "" ;
    var path = window.location.pathname;
    if(parent.hasClass('radiobuttons')) {
      ga('send', 'event', path , 'Radio button: ' + label + ' checked', q);
    } else if(parent.hasClass('checkboxes')) {
      ga('send', 'event', path , 'Checkbox: ' + label + ' checked', q);
    }
  });

  // Analytics for Select
  $('select.analyze').bind( "change", function() {
    var q = $(this).val();
    var label = $(this).prev('label').length > 0 ? $(this).prev('label').html() : "" ;
    var path = window.location.pathname;
    ga('send', 'event', path , 'Dropdown:' + label + ' endret valg.', q);
  });

  //Analytics for Datepicker
  $('.datePicker.analyze').bind('dp.change dp.show', function(){
    var q = $(this).find('input').val();
    var label = $(this).prev('label').length > 0 ? $(this).prev('label').html() : "" ;
    var path = window.location.pathname;
    ga('send', 'event', path , 'Date changed for: ' + label, q);
  });

});
