// This Javascript file contains functions required for the site search function with type-ahead
// The search.js needs typeahead.bundle.min.js to function.
// It also needs some data to function. It is for now stored in data/searchdata.js as global variables.

var s,search = {

  settings : {
    start : 0,
    searchParentWidthPercent : "",
    backgroundColor : "",
    maximized : "",
    animating : "",
    animSpeed : "",
    searchIsRunning : false,
    hitcounter : 0,
    hasURL :  false,
    urlParams : undefined,
    initialWidth: ""
  },

  categoryConfig : [{
    hint: true,
    highlight: true,
    minLength: 3,
    limit: 10
   }],

  promotions : "",
  typeaheads : {},

  init : function(){
    s = this.settings;

    if (typeof enonicSearchData === 'undefined') {
      //console.log("Could not find searchdata for autocomplete and typeahead. Search will have less functionality on this page.");
      return;
    } else if (enonicSearchData === null) {
      //console.log("Search data was empty. Typeahead and autocomplete will not work.");
      return;
    }

    search.promotions = enonicSearchData.search.promotions !== undefined ? enonicSearchData.search.promotions.promotion :  undefined;

    if(enonicSearchData.search.autocomplete !== undefined && enonicSearchData.search.autocomplete.anbefalt !== undefined){
       search.typeaheads.anbefalte = enonicSearchData.search.autocomplete.anbefalt;
    }

    if(enonicSearchData.search.typeahead !== undefined && enonicSearchData.search.typeahead.direkte !== undefined){
       search.typeaheads.direkte = enonicSearchData.search.typeahead.direkte;
    }

    //typeaheads['anbefalte'] = anbefalte;
    // Make search in menu header visible
    search.activateSearch();
    // Perform the search
    search.performSearch();
  },
  performSearch : function(){
    // Perform search only on the search results page (add other pages if necessary)
    if ($('#main_search').length > 0 ){
      //Get the search term from the URL
      s.urlParams = this.getQuery();
      s.searchIsRunning=false;

      s.start = 0; // Start from the first group of search results from Google

      //If the start parameter is something else than nothing, get the new starting point for the up-coming Google search
      if (s.urlParams.start!==undefined && s.urlParams.start.length > 0 ) {
        s.start = s.urlParams.start;
      }

      // If there is a search term to use, perform the search
      if (s.urlParams.q!==undefined && s.urlParams.q.length > 0 ) {
        var strQuery =  search.stripChars(s.urlParams.q);
        $("form.stb-form-inline input.searchbox").val(strQuery);
        search.getPromotions();
        search.searchQuery(strQuery, s.start);
      }
    }
  },
  activateSearch : function () {
    $('#desktop-menu ul.nav li.search').show();

    // Prepare for type-ahead
    if(search.typeaheads !== ""){
      search.initTypeahead();
    }
    // The search field on desktop must be made extendable upon click
    search.initExtendedSearch();

  },
  initTypeahead : function(){

    //Make sure to initiate anbefalte søkeord first
    if("anbefalte" in search.typeaheads){
      this.createDatasets("anbefalte");
    }
    if("direkte" in search.typeaheads){
      this.createDatasets("direkte");
    }

    // Call  the typeahead with the category config
    $.fn.typeahead.apply( $('.searchbox.typeahead'), search.categoryConfig);

    $('input.searchbox').bind('typeahead:selected', function(event,data) {
      //Check whether Google Analytics is initialized, and if so, send event logging there
      if( typeof(ga) === 'function' ) {
        ga('send', 'event', 'search', 'selected', 'Search for: '+data.name);
      }
      if (data.url) {
        //Go to the defined URL for the current search keyword
        s.hasURL = true;
        window.location.href = encodeURIComponent(data.url);
      }
      $('.typeahead').typeahead('close');
    });

    // Call checkSearch when hitting Enter while in the input area

  },
  createDatasets : function (index){

    // Make use of the Bloodhound suggestion engine in order to use an array of datums(js objects)
    var category =  new Bloodhound( {
      // A function with the signature (datum) that transforms a datum into an array of string tokens.
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('query'),
      // A function with the signature (query) that transforms a query into an array of string tokens.
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      // An array of datums
      local: this.typeaheads[index]
    });

    category.initialize();

    var catObj = {
      name : index,
      displayKey: 'name',
      source: category.ttAdapter(),
      templates: {
      }
    };
    this.categoryConfig.push(catObj);
  },
  // Remove certain special characters from search, in order to not break the Google search URL
  checkSearch : function (query) {
    //absURL is defined elsewhere so not initialized here again
    window.location = $('input.searchbox.tt-input.tt-desktop').attr('data-search-url')+"#?action=search&cludoquery=" + encodeURIComponent(search.stripChars(query));  // link to the search result page
  },
  initExtendedSearch : function() {

    // Save the state of the search box. The search box is not in focus by default.
    s.maximized=false;

    // Save the animation state, whether the element is being animated or not.
    s.animating=false;

    // Animation speed
    s.animSpeed = 800;

    // Set initial width
    s.initialWidth =  $('.navbar-nav .twitter-typeahead').css('width');

    // Close search if Escape button is pressed
    $("input.searchbox").keydown(function(event){
      if(event.which === 27){
        $(this).blur();
      }
    });

    // Close search if close icon is clicked
    $('.navbar-nav .search .remove').click(function(){
      search.minimizeSearch();
    });

   $('.navbar-nav .typeahead.tt-input').blur(function(e) {
       e.preventDefault();
       if(s.maximized && !s.animating && $('.tt-desktop.typeahead.tt-input').typeahead('val').trim().length === 0) {
         search.minimizeSearch();
       }
   });
   $('.navbar-nav .typeahead.tt-hint').focus(function(e) {
	   e.preventDefault();
	   $('input.searchbox.tt-input.tt-desktop').focus();
   });
    // If the search icon or the input element itself gets clicked, do not pass the click event to the document.
   $('.navbar-nav .typeahead.tt-input').focus(function(e) {
       e.preventDefault();
       // If it's currently minimized and not animating, maximize it.
       if (!s.maximized && !s.animating) {
         search.maximizeSearch();
       }
       // This will prevent the minimizeSearch from being called too early.
    });

    $("input.searchbox").keydown(function(event){
	  if(!s.hasURL){
		if(event.which === 13 && this.value.trim()){
		   var searchVal = $('.tt-desktop.typeahead.tt-input').typeahead('val').trim();
		   if(/\d{11}/.test(searchVal) || /\d{10}/.test(searchVal)){
			   search.minimizeSearch();
			   setTimeout(function(){
					 $('li.login>a').click();
					 var field =  $('#start-login-form input');
					 field.val(searchVal);
					 $('#start-login-form').data('bootstrapValidator').updateStatus(field, 'NOT_VALIDATED').validateField(field);
					 $('#start-login-form').submit();
			  }, s.animSpeed);
		   }else{
			   search.checkSearch( this.value );
		   }
		   return false;
		}
	  }
	});

	$('.search-icon').on('click',function(event){
	  event.preventDefault();
	  if($(event.target).closest('form').is('#searchMobile')){
		  if($('.tt-mobile .typeahead.tt-input').typeahead('val').trim()){
		   search.checkSearch($('.tt-mobile .typeahead.tt-input').typeahead('val'));
		  }
	  }else{
		var searchVal = $('.tt-desktop.typeahead.tt-input').typeahead('val').trim();
		if(/\d{11}/.test(searchVal) || /\d{10}/.test(searchVal)){
			if(s.maximized){
             search.minimizeSearch();
			 setTimeout(function(){$('li.login>a').click();
					var field =  $('#start-login-form input');
					field.val(searchVal);
					$('#start-login-form').data('bootstrapValidator').updateStatus(field, 'NOT_VALIDATED').validateField(field);
					$('#start-login-form').submit();
			 }, s.animSpeed);
			}else{
			  setTimeout(function(){ $('input.searchbox.tt-input.tt-desktop').focus(); }, s.animSpeed);
			}
		}else{
			if(s.maximized && searchVal){
			  search.checkSearch(searchVal);
			}else if(s.maximized && !s.animating){
			   $('.navbar-nav .typeahead.tt-input').blur();
			}else if(!s.maximized && !s.animating){
               $('.navbar-nav .typeahead.tt-input').focus();
            }
		}
	  }
	});

	// Call checkSearch when clicking the submit button
	$(".searchcontainer .stb-form-inline button[type=submit]").click(function(event) {
	  //alert($('input#main_search').val());
	  search.checkSearch($('input#main_search').val());
	  return false;

	});
  },
  minimizeSearch : function(){
	if(s.maximized && !s.animating){
		// Save the animating state, and reset it once the animations complete
		s.animating = true;
		$('.navbar-nav .typeahead').prop('disabled', true);

		// Hide the remove icon
		$('.navbar-nav li.search .remove').toggle();

		// Reset the searchParent to the original width. The text box will fit on its own as its width is 100 %.
		$('.navbar-nav > li.search').animate({width: s.searchParentWidthPercent+'%'},  s.animSpeed);
		$('.navbar-nav .typeahead').animate({backgroundColor: s.backgroundColor,color:"#fff"},  s.animSpeed);

		// Fade out the white search icon
		$('.navbar-nav .search-icon .search').fadeOut( s.animSpeed/4);

		// After half the animation time has passed, fade in the inverted icon
		setTimeout(function(){
		  $('.navbar-nav .search-icon .search').removeClass("charcoal").addClass("white").fadeIn( s.animSpeed/2);
		}, s.animSpeed/4);

		$('.navbar-nav .search-icon').animate({backgroundColor: s.backgroundColor}, s.animSpeed);

		// Reset all the states after the animations complete
		setTimeout(function(){
		  // Show the menu
		  $('.navbar-nav > li.group').toggle();

		  // Reset the span container to initial value
		  $('.navbar-nav .twitter-typeahead').css('width',s.initialWidth);
      // Save the new state
      s.maximized = false;
      s.animating = false;
      $('.navbar-nav .typeahead').prop('disabled', false);
		},  s.animSpeed);
    }
  },
  maximizeSearch : function (){
   if(!s.maximized && !s.animating){
    // Save the animation state, and reset it once the animations complete
    s.animating = true;
		s.maximized = true;

		//Hide overlay when search is focus
		$('.shadow-overlay').hide();

		// Store the current width
		var searchParentWidth = $('.navbar-nav > li.search').css('width');
		s.backgroundColor = $('.navbar-nav .typeahead').css('background-color');
		// Since the width is given in pixels instead of percentage, we need to calculate it ourselves
		s.searchParentWidthPercent = Math.round(100*(parseInt(searchParentWidth) / $('.navbar-nav').width()));

		// Hide the menu
		$('.navbar-nav > li.group').toggle();

		// Expand the search parent to take 95 % of the available width
		$('.navbar-nav > li.search').css('width','95%');

		// Fade out the white search icon
		$('.navbar-nav .search-icon .search').fadeOut( s.animSpeed/4);

		// After fading out icon, fade in inverted (charcoal) icon with new background
		setTimeout(function(){
		  $('.navbar-nav .search-icon .search').removeClass("white").fadeIn(s.animSpeed/2);
		}, s.animSpeed/4);

		$('.navbar-nav .search-icon').animate({backgroundColor:'"fff'}, s.animSpeed);

		// Animate span parent container to 100 %
		$('.navbar-nav .typeahead').animate({width:'100%',backgroundColor:'"fff',color:"#000"}, s.animSpeed);

		// Animate the text box
		$('.navbar-nav .twitter-typeahead').animate({width:'100%',backgroundColor:'"fff',color:"#000"}, s.animSpeed);

		// Show the "Close search" icon
		setTimeout(function(){
		  $('.navbar-nav li.search .remove').toggle();
      s.animating = false;
    }, s.animSpeed);
    }
  },
  getQuery : function (){
    // Get the query from the location URL
    var get = [];
    var decodeurl = decodeURI(location.search);
    decodeurl.replace('?', '').split('&').forEach(function (val) {
      var split = val.split("=", 2);
      get[split[0]] = split[1];
    });
    return get;
  },
  searchQuery : function ( inputQuery, start ) {
    // loader image
    $(".searchresults").append("<row><div class='col-12' style='text-align: center;'><img id='loadingimage' src='./_public/theme-storebrand.ny/images/ajax-loader.gif'></div></div>");
    s.searchIsRunning = true;

    var query = encodeURI(inputQuery); // Used because of the yahoo api. Replace with Storebrand proxy later.
    //Internet explorer ajax fix
    jQuery.support.cors = true;
    $.ajax({
      type: "GET",
      url: "https://www.storebrand.no/site/stb.nsf/domproxs?OpenAgent&url=https://www.google.com/cse?cx=005330830390972510741%3A_ylpvikmny8&client=google-csbe&gl=no&start="+start+"&num=20&output=xml_no_dtd&ie=utf8&oe=latin1&q="+query,
      dataType: "xml",
      success: search.xmlParser,
      error: function(error){
        //console.log(JSON.stringify(error));
      }
    });
  },
  getPromotions : function () {
    // Populate the promotion area
    if (s.start===0 && search.promotions !== undefined){
      search.promotions.forEach(function (promotionObj){
        if (promotionObj.query.match(new RegExp("\\b"+s.urlParams.q+"\\b",'gi'))){
          var linkDecoration = "";
          if(promotionObj.pdficon === 'true'){
            linkDecoration = ' class="pdf_document"';
          }
          $(".searchresults").append('<div class="promotion' + '"><h3>'+promotionObj.header + '<' + '/h3><' + 'p class="description">' + promotionObj.text + '</p' + ' ><p class="showurl"' + '><a'+ linkDecoration +' href="' + promotionObj.url + '">' + promotionObj.name + '<' + '/a><' + '/p><' + '/div>');
        }
      });
    }
  },
  xmlParser : function (xml) {
    $("#loadingimage").remove();
    s.searchIsRunning = false;
    var noresult = false;

    // If this is the first set of results to be parsed
    if(s.start===0){

      // Prepare the result summary for populating the status of the search result ( found or not)
      var resultSummary = '<div class="resultsummary row"><div class="col-sm-12"></div></div>';
      $(resultSummary).insertAfter($('.stb-form-inline #main_search.searchbox').closest('form').parent().parent());

      // Show search suggestions
      if($(xml).find("R").length===0 && $(xml).find("Spelling").length > 0){
        $(xml).find("Spelling").each(function() {
          var suggestedSpelling = $(this).find("Suggestion").attr("q");
          $(".resultsummary div").append('<div id="suggestion"' + '>Vi har f&aring; eller ingen treff p&aring; det s&oslash;keordet, men pr&oslash;v <a href="#?action=search&cludoquery=' + suggestedSpelling + '">' + suggestedSpelling + '<' + '/a>.<' + '/div>');
          noresult= true;
        });
      }

      // If we don't get anything initially, show corresponding message
      if ($(xml).find("R").length===0 && $(xml).find("Spelling").length===0 ) {
        $(".resultsummary div").append('<div class="nogo"' + '>Fant ingen treff ved s&oslash;k etter <' + 'strong>'+ unescape($(xml).find("Q").text())+'<' + '/strong>.<' + '/div>');
        noresult=true;
      }

      // Store number of results
      s.hitcounter = parseInt($(xml).find("M").text());

      // Populate the result summary for the search result (search term and total number of results)
      if (!noresult) {
        $(".resultsummary div").append('<p>Ditt s&oslash;k etter &laquo;'+$(xml).find("Q").text()+'&raquo; gav '+( s.hitcounter>100?" mer enn 100 " :  s.hitcounter)+' treff.</p>');
      }
    }

    // Display the results
    if(!noresult) {
      search.displaySearchResult(xml);
    }
  },
  displaySearchResult : function (xml) {
    // Parse the results elements
    $(xml).find("R").each(function () {
      //Get the search result item's string and sanitize it
      var strippedS = $(this).find("S").text();
      var stripRE = new RegExp("<br>", "g");
      strippedS = strippedS.replace(stripRE, "");

      //Get the search result item's page URL and shorten it
      var showU = $(this).find("U").text();
      var strippedU = showU;
      var stripU = new RegExp("http://www.", "g");
      strippedU = strippedU.replace(stripU, "");
      stripU = new RegExp("https://www.", "g");
      strippedU = strippedU.replace(stripU, "");
      var shortenedU = "";
      if(strippedU.length > 85) {
        shortenedU =  strippedU.substring(0,35) + "..." + strippedU.substring(strippedU.length-40, strippedU.length);
      } else {
        shortenedU = strippedU;
      }
      //get the index of the last / in the url
      var lastSlashIndex = shortenedU.lastIndexOf("/");
      //if the last / was at the end of the URL, for example in storebrand.no/bank/
      if( lastSlashIndex+1 === shortenedU.length ) {
        //remove the last /
        shortenedU = shortenedU.substr( 0, shortenedU.length-1 );
        //now look for the new last /
        lastSlashIndex = shortenedU.lastIndexOf("/", lastSlashIndex);
      }
      //if no slash was found, reset it to 0
      if( lastSlashIndex === -1 ) {
        lastSlashIndex = 0;
      }
      //if there are more than 1 slash, then we want to add "/..." to the start of the short URL
      var numOfSlashes = (shortenedU.split("/").length - 1);
      shortenedU = decodeURI(unescape(( numOfSlashes > 1?"/...":"" ) + shortenedU.substr( lastSlashIndex )));

      //Setup any special classes to identify result type
      var linkDecoration = "";
      if (strippedU.indexOf(".pdf") > 0) {
        linkDecoration = ' class="pdf_document" ';
      }

      //Prepare and display the result markup
      var resultMarkup = '<div><h4><a ' + linkDecoration + ' href="'  + $(this).find("U").text() + '">' + $(this).find("T").text() + '<' + '/a><' + '/h1><' + 'p class="description">' + strippedS + '</p' + ' ><p class="showurl"' + '><a href="' + showU + '">' + shortenedU + '<' + '/a><' + '/p><' + '/div>';
      $(".searchresults").append(resultMarkup);
    });
  },
  scroll : function(){
   if ($('#main_search').length > 0 ){
      // Prevent the scroll from searching again while the search is still running, or if the search result limit has been reached
      if (s.searchIsRunning===true || (s.start+20)> s.hitcounter ) {
        return false;
      }

      // If the page has search query and the user has scrolled to the bottom of the page, load more search results
      if((s.urlParams.q!==undefined &&  s.urlParams.q.length>0) && $(window).scrollTop() + $(window).height() === $(document).height()) {
        // Show message after searching 40 items
        if(s.start>=40) {
          $(".searchresults").append("<row><div class='col-12' style='text-align: center;'> <p class='intro'>Kanskje du b&oslash;r pr&oslash;ve et <a href='#'> annet s&oslash;keord</a>?</p></div></div>");
          s.hitcounter = 0;
          return false;
        }

        //Start from the next 20 search results
        s.start =  s.start + 20;
        search.searchQuery( s.urlParams.q , s.start);
      }
   }
  },
  stripChars: function(query){
    var reg1 = new RegExp("\"","g");
    var reg2 = new RegExp("'", "g");
    var reg3 = new RegExp("<", "g");
    var reg4 = new RegExp(">", "g");
    query = query.replace(reg1, "");
    query = query.replace(reg2, "");
    query = query.replace(reg3, "");
    query = query.replace(reg4, "");

    return query;
  }
};

$(document).ready(function(){
  search.init();
});

//Detect page scrolling to load new search results
$(document).scroll(function(event){
  search.scroll();
});