
window.addEventListener("load", () => {
    console.log(document.cookie)
    let videoId = document.cookie.split("=")[1];
  
    if (YT) {
      new YT.Player("video-placeholder", {
        height: "300",
        width: "100%",
        videoId: videoId
      });
  
    //   loadComments(videoId);
    }
  });