// This loads the IFrame Player API code asynchronously, only on pages that actually contain video references as divs with certain classes
$(document).ready(function() {
  if($("div.video-player-inline").length > 0 || $("div.banner-video").length > 0) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
});

var bootstrapEnv;

// This function creates an <iframe> (and YouTube player) after the API code downloads.

function onYouTubeIframeAPIReady() {
  bootstrapEnv = findBootstrapEnvironment();
  $('.video-player-banner').each(function(index, element){
    new YT.Player($(element).attr('id'), {
      videoId: $(element).attr('data-youtube-id'),
      playerVars: { autohide:1, modestbranding: 0, controls: 1,theme:'light',html5:1, showinfo:0, rel:0},
      events: {
        'onReady': onPlayerReadyBanner,
        'onStateChange': onPlayerStateChangeBanner
      }
    });
  });

  $('.video-player-inline').each(function(index, element) {
    new YT.Player($(element).attr('id'), {
      videoId: $(element).attr('data-youtube-id'),
      playerVars: { autohide:1, modestbranding: 0, controls: 1,theme:'light',html5:1, showinfo:0, rel:0}
    });
  });
}

function onPlayerReadyBanner(event) {
  $('.playVideoBtn').click(function() {
    playVideoBanner(event.target,this);
  });

  $('.video-close').click(function() {
    stopVideoBanner(event.target,this);
  });
}

// The API calls this function when the player's state changes.
function onPlayerStateChangeBanner(event) {
  if(event.data === 0) {
    stopVideoBanner(event.target);
  }
}

function stopVideoBanner(player, btn) {
  if(bootstrapEnv === 'md' || bootstrapEnv === 'lg') {
    player.stopVideo();
  }
  var bannerVideo = $(btn).closest('.banner-video');
  bannerVideo.children('.video-container').hide();
  bannerVideo.children('.video-text').show();
  bannerVideo.parent().addClass('top-padding-30');
  var dataLayer = dataLayer||[];
  dataLayer.push({'event' : 'stopYouTubeVideo', 'youTubeTS' : player.getCurrentTime()});
  var iframeVideos = document.getElementsByTagName("iframe");
  if (iframeVideos != null) {
    for (var i = 0; i < iframeVideos.length; i++) {
      if (iframeVideos[i].src.substring(12,19)=="youtube") {
        iframeVideos[i].src = iframeVideos[i].src;
      }
    }
  }  
}

function playVideoBanner(player, btn) {
  var bannerVideo = $(btn).closest('.banner-video');
  bannerVideo.parent().removeClass('top-padding-30');
  bannerVideo.children('.video-text').hide();
  bannerVideo.children('.video-container').show(0, function() {
   if(bootstrapEnv === 'md' || bootstrapEnv === 'lg'){
     player.playVideo();
   }
  });
  var dataLayer = dataLayer||[];
  dataLayer.push({'event' : 'startYouTubeVideo' });
}