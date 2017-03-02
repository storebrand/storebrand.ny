
  // Handling automatic generation of TOC lists on article pages
  // Prepare the TOC link for a given header tag


  function prepareTocLink(headerTag, prefix) {
    // Take the header text
    var headerText = headerTag.text();
    // Prepare the header ID from its text
    headerTag.attr("id",prefix.replace(/ /g,"-").toLowerCase() + "--" + headerText.replace(/\-/g,'').replace(/ /g,"-").replace(/[æå]/gi,'a').replace(/ø/gi,'o').toLowerCase()); // generating id for the h3
    var headerId = headerTag.attr("id").replace(/\W/g, ''); // set the id
    headerTag.attr('name', headerId);
    // Create the link and return it

    if (headerText === "") {
      return '';
    }  else {
      return '<li><a href="#'+headerId+'">'+headerText+'</a></li>';
    }

  }

  $(document).ready(function() {
    // Prepare the row that contains the table of contents
    var tocList ='<div class="row"><div class="col-md-8 toc-list top-padding-10 border-top-and-bottom stbcolor-background fifth"><p class="intro"><a href="#" onclick="$(\'.toc-list .items\').slideToggle();$(\'.toc-list p span\').toggleClass(\'chevron-down red chevron-up\');return false;">G&aring; direkte til<span class="stb-sprite-medium chevron-down pull-right"></a></span></p><ul class="items"></ul></div></div>';

    // Place the table of content above the first hx.toc-header
    if($('h2.toc-header:not(.toc-hidden)').length===0) {
      $(tocList).insertBefore( $('h3.toc-header:not(.toc-hidden):first').closest("div.row") );
    } else {
      // When we don't have to support h3-based toc any more, we can replace this if sentence with just the following line
      $(tocList).insertBefore( $('h2.toc-header:not(.toc-hidden):first').closest("div.row") );
    }

    // Find all the top level TOC headings (h2)
    var tocHeaders= $('h2.toc-header:not(.toc-hidden)');
    // Small more or less temporary fix, because we moved the tocHeaders from h3 to h2
    var tocMode = "h2";
    if (tocHeaders.length===0) {
      tocHeaders = $('h3.toc-header:not(.toc-hidden)');
      tocMode = "h3";
    }

    // Iterate through all the top level headings
    for(var i=0; i<tocHeaders.length; i++) {
      var heading = $(tocHeaders[i]);

      // Appending heading text to table to contents and also preparing links
        $('.toc-list .items').append( prepareTocLink(heading, ""));

      // Find all sub-headings(h3) inside each heading(h2)
      var subHeading = heading.nextUntil('h2','h3');
      // h3->h2 temporary fix if
      if (tocMode==="h3") {
        subHeading = heading.nextUntil('h3','h4');
      }

      // Check if there are any h4 elements. If there are none, we should not run the code below.
      if(subHeading.length === 0) continue;
    }

    //check if URL already has a hash and scroll to the correct heading
    if( window.location.hash.length > 0 && window.location.hash.indexOf("/") === -1 ) {  // only do scrolling now, since the has tag is present and it does not have a / which is for angular JS
      try {
        var hashId = window.location.hash;
        //if a matching heading has the hash ID, then scroll to it.

        if( hashId.length > 0 ) {
          scrollToHash( hashId );
        }

      } catch(e) {
        // Don't do a thing!
      }
    }

    // Perform a smooth page scroll to an anchor on the same page.
    $(function() {
      // err: $('.toc-list .items a[href*=#]:not([href=#])').click(function(event) {
      $('.toc-list .items a[href^="#"]').click(function(event) {
        event.preventDefault();
        //if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        scrollToHash( this.hash);
        //}
      });
    });

    // replace medium with small chevron icon in mobile view
    if( $( window ).width() <= 768) {
      $('.toc-list p span').toggleClass("stb-sprite-small stb-sprite-medium");
    }

  });
  // End of automatic generation of toc lists on article pages
