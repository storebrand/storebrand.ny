
/*
 * Common functions for general use
 /*

 /* ***** SCROLL TO ***** */
function stbScrollTo(id,more) {
  $('html,body').animate({scrollTop: $('#'+id).height()}, 800);
}

// Take a hash as input and smooth-scroll to the related target element
function scrollToHash(hash) {
  var target = $(hash);
  target = target.length ? target : $('[name=' + hash.slice(1) +']');
  if (target.length) {
    var scrollToPosition = target.offset().top;
    // Checking if the navigation header is fixed. If yes, set the scrollto position by subtracting the height of the fixed header
    if($('.navbar-fixed-top').css("display") === "block") {
      scrollToPosition -= $('.navbar-fixed-top').height() - 1;
    }
    $('html,body').animate({ scrollTop: scrollToPosition }, 1000);
    // Highlighting the clicked heading for a brief period to make it easier to see what just happened.
    $(target).not('div').animate({backgroundColor:"#FFF0F0"},1000);
    $(target).not('div').animate({backgroundColor:"#FFFFFF"},1000);
  }
}

/* ***** Verify National Identity Number ***** */
/*PRIVATE*/
function verifyIDNumber(nr) {
  var pn = [];
  var v1 = [3,7,6,1,8,9,4,5,2,1,0];
  var v2 = [5,4,3,2,7,6,5,4,3,2,1];
  for(var i=0; i<nr.length; i++) {
    pn[i] = nr.charAt(i);
  }
  var k1=0;
  for(i=0; i<v1.length; i++) {
    k1 += pn[i]*v1[i];
  }
  var k2=0;
  for(i=0; i<v2.length; i++) {
    k2 += pn[i]*v2[i];
  }
  if (k1%11===0 && k2%11===0 ) {
    return true;
  }
  else {
    return false;
  }
}
/*CORPORATE*/
/* Added access for Swedish Identity Numbers and D-number */
function verifyIDNumberCorporate(nr) {
  var pn = [];
  var v1 = [3,7,6,1,8,9,4,5,2,1,0];
  var v2 = [5,4,3,2,7,6,5,4,3,2,1];
  for(var i=0; i<nr.length; i++) {
    pn[i] = nr.charAt(i);
  }
  var k1=0;
  for(i=0; i<v1.length; i++) {
    k1 += pn[i]*v1[i];
  }
  var k2=0;
  for(i=0; i<v2.length; i++) {
    k2 += pn[i]*v2[i];
  }
  var nrString = ""+nr;
  if(nr.length ===10 | nr.length ===12){
    return true;
  }
  else if(nrString.length ===11 & Number(nrString.substring(0,2)) > 31){
    return true;
  }
  else if (k1%11===0 && k2%11===0 ) {
    return true;
  }
  else {
    return false;
  }
}

/* ***** ENCODE AND DECODE BASE64 ***** */
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf(" chrome/") >= 0 || ua.indexOf(" firefox/") >= 0 || ua.indexOf(' gecko/') >= 0) {
  var StringMaker = function () {
    this.str = "";
    this.length = 0;
    this.append = function (s) {
      this.str += s;
      this.length += s.length;
    };
    this.prepend = function (s) {
      this.str = s + this.str;
      this.length += s.length;
    };
    this.toString = function () {
      return this.str;
    };
  };
} else {
  var StringMaker = function () {
    this.parts = [];
    this.length = 0;
    this.append = function (s) {
      this.parts.push(s);
      this.length += s.length;
    };
    this.prepend = function (s) {
      this.parts.unshift(s);
      this.length += s.length;
    };
    this.toString = function () {
      return this.parts.join('');
    };
  };
}
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
  var output = new StringMaker();
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  while (i < input.length) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output.append(keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4));
  }
  return output.toString();
}

function decode64(input) {
  var output = new StringMaker();
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output.append(String.fromCharCode(chr1));
    if (enc3 !== 64) {
      output.append(String.fromCharCode(chr2));
    }
    if (enc4 !== 64) {
      output.append(String.fromCharCode(chr3));
    }
  }
  return output.toString();
}
/* ***** END OF BASE64 OPERATIONS ***** */

/* ***** GET URL PARAMETER BY NAME ****** */
function gup(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results === null ) {
    return "";
  } else {
    return results[1];
  }
}
/* ***** END OF GET URL PARAMETER BY NAME ***** */

/* ***** START TOGGLING "important messages" ***** */

function showImportantNotice() {
  $('.important-notice').each(function() {
    if (readCookie($(this).attr('id')) === null) {
      $(this).slideDown('slow');
    }
  });
}

function hideImportantNotice(element){
  var notice = $(element).closest('.important-notice');
  $(notice).slideUp('fast');
  createCookie($(notice).attr('id'),'true');
}

function showCommonMsg(element) {
  if(element !== undefined){
    $(element).parent().next('.commonmessage').slideToggle('fast');
  }else{
    $('.commonmessage').slideDown('fast');
  }
}

function hideCommonMsg(element) {
  $(element).closest('.commonmessage').slideUp('fast');
  createCookie('commonMessageRead','Yes');
}

function showErrorMsg() {
  $('.errormessage').slideDown('slow');
}

function hideErrorMsg(element) {
  $(element).closest('.errormessage').slideUp('slow');
  createCookie('errorMessageRead','Yes');
}
/* ***** END TOGGLING "important messages" ***** */

/* ***** CREATE COOKIE ***** */
function createCookie(n,value,days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    expires = "; expires="+date.toGMTString();
  } else {
    expires = "";
  }
  dom = "; domain=.storebrand.no";
  document.cookie = n+"="+value+expires+"; path=/"+dom;
}

/* ***** READ COOKIE ***** */
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

/* ***** ERASE COOKIE ***** */
function eraseCookie(name) {
  createCookie(name,"",-1);
}

/* ***** Functionality for login ***** */
function loginFromMenu(fnr) {
  var pid64= encode64(fnr);
  window.location.href="https://www2.storebrand.no/site/guiding.nsf/bankCheck?openpage&pid64="+pid64;
}
function loginFromMenuCorporate(fnr){
  var pid64= encode64(fnr);
  var bankIdPage = $('#start-login-form-corporate').attr('data-loginallpage');

  window.location.href= bankIdPage + "?user=" + pid64;
  //window.location.href="http://localhost:8080/site/3/bedrift/min-bedrift/logg-inn-bedriftsportalen?user=" + pid64;
  //window.location.href="https://www2.storebrand.no/site/guiding.nsf/bankCheck?openpage&pid64="+pid64;
}

 $(document).ready(function() {
  var temp = gup('login');
  if(temp==='yes'){
    setTimeout(function(){
      $("#menuLogin").dropdown("toggle");
    },1000);
  }
});
/* ***** End of functionality for login ***** */

/* ***** Function for opening chat ***** */
$.fn.extend({
  openChat: function() {
    var width = 650;
    var height = 450;
    var leftPosition = (screen.width/2)-(width/2);
    var topPosition = (screen.height/2)-(height/2);
    var url = $(this).attr("href");
    var parameters = 'toolbar=no,menubar=no,scrollbars=no,resizable=yes,width='+width+',height='+height+',left='+leftPosition+',top='+topPosition;
    window.open(url, '_blank', parameters);
  }
});
/* ***** End of Function for opening chat ***** */

/* ***** Function for initializing Bootstrap validator ***** */
function initBootstrapValidator (formSelector,validatorFields,successcallback,errorcallback,live) {
  formSelector.bootstrapValidator({
    live: live === undefined ? 'disabled' : live,
    group: '.stb-form-group',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: validatorFields
  }).on('success.form.bv',successcallback).on('err.form.fv',errorcallback);
}
/* ***** End of Function for initializing Bootstrap validator ***** */


/* ***** Function for finding the Bootstrap environment ***** */
function findBootstrapEnvironment() {
  var envs = ['xs', 'sm', 'md', 'lg'];

  $el = $('<div>');
  $el.appendTo($('body'));

  for (var i = envs.length - 1; i >= 0; i--) {
    var env = envs[i];

    $el.addClass('hidden-'+env);
    if ($el.is(':hidden')) {
      $el.remove();
      return env;
    }
  }
}
/* ***** End of Function for finding the bootstrap environment ***** */

// Function for helping tablesorter make sense of all kinds of table data by using data-sort-value attribute in header instead of actual table cell contents
// Parser needed to make tablesorter understand how to sort our data correctly, overriding the standard .tablesorter() function
function sortTable(sortWhere) {
  $(sortWhere).tablesorter({
    textExtraction: function(node) {
      var attr = $(node).attr('data-sort-value');
      if (typeof attr !== 'undefined' && attr !== false) {
        return attr;
      }
      return $(node).text();
    }
  });
}
// End of tablesorter parser fix

// Rounding off numbers to 2 decimals
function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}
// End of 2 decimals rounding
