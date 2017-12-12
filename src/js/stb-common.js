
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

// Code needed for including funds lists
function listFunds(fundsArray, tableTitle, insertWhere, showSustainability, showRisk, showTrade) {
  if (tableTitle!="") {
    if ($("#tableTitle") != undefined) {
      $("#tableTitle").html("<p class='header3'>" + tableTitle + "</p>");
    }
  }

  if (fundsArray != undefined && fundsArray != null && fundsArray.length > 0) {
    // Setting up for potential sales links
    var buyability="";
    var buyHeader = "";
    var buyFooter = "";
    
    // Setting up for potential sustainability column
    var sustainabilityHeader = ""; 
    var sustainabilityFooter = ""; 

    // Setting up for potential sustainability column
    var riskHeader = ""; 
    var riskFooter = ""; 

    // Three possible tradeLink values decides whether a trade link/button should be included in the table or not.
    if (showTrade==="private") {
      buyability="private";
      buyHeader="<th class=\"no-sort\">&nbsp;</th>";
      buyFooter="<td></td>";
    } else if (showTrade==="professional") {
      buyability="professional";
      buyHeader="<th class=\"no-sort\">&nbsp;</th>";
      buyFooter="<td></td>";
    } else {
      buyability="undecided";
      buyHeader="";
      buyFooter="";
    }

    if (showSustainability==="show") {
      sustainabilityHeader = "<th class=\"hidden-xs\">Bærekraftsnivå</th>";
      sustainabilityFooter = "<td></td>";
    } else {
      sustainabilityFooter = "<td class=\"visible-xs\"></td>";
    }

    if (showRisk==="show") {
      riskHeader = "<th class=\"hidden-xs\">Risiko</th>"; 
      riskFooter = "<td class=\"hidden-xs\"></td>";
    } else {
      riskFooter = "";
    }

    // Setting up predefined arrays of funds
    if (fundsArray[0]=="" || fundsArray[0]=="standard") {
      fundsArray = ["NO0010670755", "NO0010039712", "NO0010317282", "NO0010039696", "NO0010039670", "NO0010039688", "NO0008000940", "NO0008000767", "NO0010297328", "NO0010588031", "NO0010346422", "NO0010033053", "NO0008000973", "NO0008000858", "NO0010611148", "NO0010704265", "NO0010611130", "NO0010302854", "NO0008000957", "NO0008000783", "NO0010044621", "NO0010625734", "NO0010625742", "NO0010080815", "NO0010283021", "NO0010076417", "NO0010657273", "NO0008000841", "NO0008000999"];
    } else if (fundsArray[0]=="delphi") {
      fundsArray = ["NO0010670755", "NO0010039712", "NO0010317282", "NO0010039696", "NO0010039670", "NO0010039688"];
    } else if (fundsArray[0]=="storebrand") {
      fundsArray = ["NO0008000940", "NO0008000767", "NO0010297328", "NO0010588031", "NO0010346422", "NO0010033053", "NO0008000973", "NO0008000858", "NO0010611148", "NO0010704265", "NO0010611130", "NO0010302854", "NO0008000957", "NO0008000783", "NO0010044621", "NO0010625734", "NO0010625742", "NO0010080815", "NO0010283021", "NO0010076417", "NO0010657273", "NO0008000841", "NO0008000999"];
    } else if (fundsArray[0]=="storebrand-private") {
      fundsArray = ["NO0010039712", "NO0010670755", "NO0010317282", "NO0010039696", "NO0010039670", "NO0010039688", "NO0008000767", "NO0010346422", "NO0008000973", "NO0008000858", "NO0010611148", "NO0010704265", "NO0010611130", "NO0010302854", "NO0008000783", "NO0010283021", "NO0010657273", "NO0008000841", "NO0008000999"];
    } else if (fundsArray[0]=="storebrand-professional") {
      fundsArray = ["NO0008000940", "NO0010297328", "NO0010588031", "NO0010033053", "NO0008000957", "NO0010044621", "NO0010625734", "NO0010625742", "NO0010080815", "NO0010076417"];
    } else if(fundsArray[0]=="active") {
      fundsArray = ["NO0010670755", "NO0010039712", "NO0010317282", "NO0010039670", "NO0010039688", "NO0008000940", "NO0008000783", "NO0010080815", "NO0008000841", "NO0008000999"];
    } else if(fundsArray[0]=="factor") {
      fundsArray = ["NO0010346422", "NO0008000973", "NO0010657273"];
    } else if(fundsArray[0]=="index") {
      fundsArray = ["NO0010297328", "NO0010611148", "NO0010611130", "NO0010704265"];
    } else if(fundsArray[0]=="interest") {
      fundsArray = ["NO0010625734", "NO0010625742", "NO0010283021", "NO0010588031", "NO0010033053", "NO0008000957", "NO0008000858", "NO0010076417"];
    }

    var insertionPoint = $(insertWhere);
    var strippedInsertWhere = insertWhere.substring(1, insertWhere.length);
    if (insertionPoint != undefined && insertionPoint != null) {
      var newHTML = "";
      var jsonFundsURL = "https://www.storebrand.no/api/open/fundlist/list";
      $.getJSON( jsonFundsURL, function (json) {
        if (json === null || json === undefined || json.length === 0 ) {
          newHTML = newHTML + '<h2 style="margin:20px;color:red">Vi har problemer med å hente fondsinformasjon</h2>';
        } else {
          newHTML = newHTML + '<thead><tr><th style=\"text-align: left;\">Fond</th><th class=\"hidden-xs text-right\">Dato</th><th class=\"text-right\">I&nbsp;år</th><th class=\"hidden-xs text-right\">Årlig&nbsp;siste&nbsp;3&nbsp;år</th><th class=\"text-right\">Årlig&nbsp;siste&nbsp;5&nbsp;år</th>' + sustainabilityHeader + riskHeader + buyHeader + '</tr></thead>';
          newHTML = newHTML + '<tbody class="fundsbody" id="fundsBody'+strippedInsertWhere+'">';
          newHTML = newHTML + '</tbody>';
          newHTML = newHTML + '<tfoot><tr><td></td><td><td class="hidden-xs"></td><td class="hidden-xs"></td><td class="hidden-xs"></td></td>' + sustainabilityFooter + riskFooter + buyFooter +'</tr>';
          insertionPoint.html(newHTML);

          for (var i = 0; i<json.length; i++) {
            var ISIN = json[i].ISIN;
            var morningstarId = json[i].MorningstarId;
            if ( fundsArray[0]=="all" || $.inArray(ISIN, fundsArray) > -1) {
              // We're explicitly told to show all funds, or the current ISIN is found in the submitted array, so this fund should definitely be included in the list

              var legalName =  json[i].Name;
              var closingPrice = json[i].ClosingPrice;
              var closingPriceDate = json[i].ClosingPriceDate;
              var lastMonth = json[i].Return.Month;
              var thisYear = json[i].Return.ThisYear;
              var thirtysixMonths = json[i].Return.ThreeYears;
              var sixtyMonths = json[i].Return.FiveYears;
              var sustainability = json[i].SustainabilityRating;
              var risk = "";
              if(json[i].Details == undefined || json[i].Details == null || json[i].Details.InvestmentRisk == undefined || json[i].Details.InvestmentRisk == null) {
                risk = "ukjent";
              } else {
                risk = json[i].Details.InvestmentRisk;
              }

              addToTable( ISIN, legalName, morningstarId, closingPriceDate, thisYear, thirtysixMonths, sixtyMonths, sustainability, risk, buyability, showSustainability, showRisk, strippedInsertWhere);
            }
          }
        }
      });
    }
  }
}

function addToTable(fundISIN, fundName, securityId, fundPriceDate, fundThisYear, fund36Months, fund60Months, sustainabilityRating, riskRating, salesTable, sustainTable, riskTable, tableId) {
  // Formatting the various input parameters to prepare them for table presentation

  if (fundPriceDate === "") {
    fundPrice = "&mdash;";
  } else {
    fundPriceDate = fundPriceDate.substring(8,10) + "." + fundPriceDate.substring(5,7);
  }

  var sortFundThisYear = fundThisYear;
  if (fundThisYear === "") {
    fundThisYear = '<span>' + "&mdash;" + '</span' + '>';
  } else if (fundThisYear <0) {
    fundThisYear = '<span class="neg">' + roundToTwo(fundThisYear ) + '&nbsp;%</span' + '>';
  } else {
    fundThisYear = '<span class="pos">' + roundToTwo(fundThisYear ) + '&nbsp;%</span' + '>';
  }
  fundThisYear = fundThisYear.replace('.',',');

  var sortFund36Months = fund36Months;
  if (fund36Months === "") {
    fund36Months = '<span class="36m"' + '>' + "&mdash;" + '</span' + '>';
  } else if (fund36Months<0) {
    fund36Months = '<span class="neg 36m"' + '>' + roundToTwo(fund36Months) + '&nbsp;%</span' + '>';
  } else {
    fund36Months = '<span class="pos 36m"' + '>' + roundToTwo(fund36Months) + '&nbsp;%</span' + '>';
  }
  fund36Months = fund36Months.replace('.',',');

  var sortFund60Months = fund60Months;
  if (fund60Months === "") {
    fund60Months = '<span class="60m"' + '>' + "&mdash;" + '</span' + '>';
  } else if (fund60Months<0) {
    fund60Months = '<span class="neg 60m"' + '>' + roundToTwo(fund60Months) + '&nbsp;%</span' + '>';
  } else {
    fund60Months = '<span class="pos 60m"' + '>' + roundToTwo(fund60Months) + '&nbsp;%</span' + '>';
  }
  fund60Months = fund60Months.replace('.',',');

  if (sustainabilityRating==="") {
    sustainabilityRating = "0";
  }

  var showSustainabilityRating = '<img src=\"https://elements.storebrand.no/storebrand.ny/0.94/images/scales/sus' + sustainabilityRating + '.png\" style=\"width: 80px;\" alt=\"Bærekraftsnivå: ' + sustainabilityRating + ' av 10\">';
  if(sustainTable==="show") {
    showSustainabilityRating = '<td class=\"hidden-xs\" data-sort-value=\"' + sustainabilityRating + '\">' + showSustainabilityRating + '</td>';
  } else {
    showSustainabilityRating = '';
  }

  if (riskRating==="") {
    riskRating = "0";
  }
  //var showRisk = '<img src=\"https://elements.storebrand.no/storebrand.ny/0.94/images/scales/risiko-' + riskRating + '.png\" style=\"width: 80px;\" alt=\"Risikonivå: ' + riskRating + '\">';
  if (riskRating == undefined) { riskRating = "Ukjent"; }
  var showRisk = riskRating + ' av 7';
  if(riskTable==="show") {
    showRisk = '<td class=\"hidden-xs\" data-sort-value=\"' + riskRating + '\">' + showRisk + '</td>';
  } else {
    showRisk = '';
  }
  
  // Preparing links to fund detail sheets, based on ISIN or Morningstar Id
  var fundURL = "";
  if (fundISIN=="NO0010039712") {
    fundURL = "https://www.delphi.no/site/delphino.nsf/Pages/fond_delphieuropa.html";
  } else if (fundISIN=="NO0010317282") {
    fundURL = "https://www.delphi.no/site/delphino.nsf/Pages/fond_delphiverden.html";
  } else if (fundISIN=="NO0010039670") {
    fundURL = "https://www.delphi.no/site/delphino.nsf/Pages/fond_delphinorden.html";
  }  else if (fundISIN=="NO0010039688") {
    fundURL = "https://www.delphi.no/site/delphino.nsf/Pages/fond_delphinorge.html";
  } else if (fundISIN=="NO0010039696") {
    fundURL= "https://www.delphi.no/site/delphino.nsf/Pages/fond_delphikombinasjon.html";
  } else if (fundISIN=="NO0010670755") {
    fundURL = "https://www.delphi.no/site/delphino.nsf/Pages/fond_demer.html";
  } else {
    // Link to detailed information on iframe from Morningstar enclosed by a Storebrand page.
    fundURL = "https://www.storebrand.no/privat/sparing/fondsark?securityid=" + securityId;
    //fundURL = "https://lt.morningstar.com/3ofqclb12f/snapshot/snapshot.aspx?SecurityToken=" + securityId + "]2]1]FOALL$$ALL_1912&clearcache=true&ClientFund=1&LanguageId=nb-NO&CurrencyId=NOK&UniverseId=FONOR%24%24ALL_1398&BaseCurrencyId=NOK";
  }
  var fundLink = '<a href="' + fundURL + '"><span class="fundName"' + '>' + fundName + '</span' + '><' + '/a>';

  if (salesTable==="private") {
    var shopURL = "https://www2.storebrand.no/fondweb/start.html?funds=" + escape('[{"isin":"' + fundISIN + '"}]');
    var buyThis = '<td><a href="' + shopURL + '"><span class="stb-sprite-small red shopping-cart"></span>&nbsp;Kjøp</a></td>';
  }  else if (salesTable==="professional") {
    var shopURL = "https://www.storebrand.no/site/stb.nsf/pages/sam-handel.html";
    var buyThis = '<td><a href="' + shopURL + '">Handle</a></td>';
  } else {
    showURL = "";
    buyThis = "";
  }

  var list = document.getElementById('fundsBody'+tableId);
  var newRow = document.createElement('tr');
  newRow.className="fundsRow";
  newRow.innerHTML = '<td>' + fundLink + '</td><td class=\"hidden-xs text-right\">' + fundPriceDate + '</td><td class=\"text-right\" data-sort-value=\"' + sortFundThisYear + '\">' + fundThisYear + '</td><td class=\"hidden-xs text-right\" data-sort-value=\"' + sortFund36Months + '\">' + fund36Months + '</td><td class=\"text-right\" data-sort-value=\"' + sortFund60Months + '\">' + fund60Months + '</td>' + showSustainabilityRating + showRisk + buyThis;
  list.appendChild(newRow);
}
// End of code for funds lists
