 const Apikey=`AIzaSyBnnOv_z3zSt6ndn85qNHKSAGHkyIbhixA`;
 const baseUrl=`https://www.googleapis.com/youtube/v3`;
 const url ="https://www.googleapis.com/youtube/v3/commentThreads";
const commentContainer= document.getElementById("comments");
const playcard= document.getElementById("player-card");
const channelD= document.getElementById("channeldiv");

window.addEventListener("load", () => {
    console.log(document.cookie)
    let videoId = document.cookie.split("=")[1];
  
    if (YT) {
      new YT.Player("video-placeholder", {
        height: "300",
        width: "100%",
        videoId: videoId
      });
  
      loadComments(videoId);
      loadvideoDetails(videoId);
    }
  });
  
 // comments loading....................

  async function loadComments(videoId)
  {
     let endpoint = `${url}?key=${Apikey}&videoId=${videoId}&maxResults=10&part=snippet`;

     let response =  await fetch(endpoint);
     let result =  await response.json();

     result.items.forEach((data)=>{
      const repliesCount = data.snippet.totalReplyCount;
      const {
          authorDisplayName,
          textDisplay,
          likeCount,
          authorProfileImageUrl: profileUrl,
          publishedAt,
      } = data.snippet.topLevelComment.snippet;

       let comment = document.createElement("div");
       comment.innerHTML=`
       <img src="${profileUrl}" alt="user"class="profile">
       <div class="comment-left">
           <b>${authorDisplayName}    <span class="grey size">    ${caluclateUploadTime(publishedAt)}</span></b>
           <p>${textDisplay}</p>
           <div class="like-share">
               <p><img src="./Assets/Button-Btn.svg" alt="like">${ converter(likeCount)}</p>
               <p><img src="./Assets/Button-Btn (1).svg" alt="dislike"></p>
               <p>reply</p>
            </div>
            <p style="color:rgb(82, 219, 82); ">${repliesCount} replies</p>
       </div>` ;
        commentContainer.appendChild(comment);
     })
  }
    // video details............

//     <div class="video-detail">
//     <p>Blind woodturner : turning passion into fine Art</p>
//     <div class="bottom-details">
//         <p> 567279 views .Oct 8,2021</p>
//         <div class="like-share">
//             <p><img src="./Assets/Button-Btn.svg" alt="like">1.17k</p>
//             <p><img src="./Assets/Button-Btn (1).svg" alt="dislike">632</p>
//             <p><img src="./Assets/Button-Btn (2).svg" alt="share">SHARE</p>
//             <p><img src="./Assets/Button-Btn (3).svg" alt="save">SAVE</p>
//             <img src="./Assets/Button-Btn (4).svg" alt="more">
//         </div>
//     </div>
// </div>


/* <div class="channel-div">
   <div class="channelLogo">
      <div>
       <img src="./Assets/User-Avatar.svg" alt="profile"class="profile">
        <div>
        <p>Marcus Levin</p>
        <p class="grey">1.2M Subscribers</p>
       </div>
     </div>
     <button class="btn-sub">SUBSCRIBES</button>
  </div>
  <div class="discription">
   <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, cupiditate nesciunt eveniet aliquid numquam soluta, sed temporibus praesentium ipsa placeat non cum, commodi quae vel harum molestiae itaque culpa! Aliquam, reprehenderit voluptatum ea ab fugit exercitationem dolorem officiis tempora cum.</p>
   <p class="grey">SHOW MORE</p>
 </div>
</div> */


   async function  loadvideoDetails(videoId){

       const endpoint1=`${baseUrl}/videos?part=snippet,statistics&id=${videoId}&key=${Apikey}`;
       let response = await fetch(endpoint1);
       let result = await response.json();
       const data=result.items[0];

        let videodetail = document.createElement("div");
        videodetail.className="video-detail";
        videodetail.innerHTML=`
        <p>${data.snippet.title}</p>
       <div class="bottom-details">
        <p> ${data.statistics.viewCount} views .${ getDate(data.snippet.publishedAt)}</p>
        <div class="like-share">
            <p><img src="./Assets/Button-Btn.svg" alt="like">${converter(data.statistics.likeCount)}</p>
            <p><img src="./Assets/Button-Btn (1).svg" alt="dislike"></p>
            <p><img src="./Assets/Button-Btn (2).svg" alt="share">SHARE</p>
            <p><img src="./Assets/Button-Btn (3).svg" alt="save">SAVE</p>
            <img src="./Assets/Button-Btn (4).svg" alt="more">
        </div>
    </div>`;
     playcard.appendChild(videodetail);
     data.channelLogo=getchannelLogo(data.snippet.channelId);

     const channeldiv = document.createElement("div");
     channeldiv.className="channel-div";
     channeldiv.innerHTML=` <div class="channelLogo">
     <div>
      <img src="${data.channelLogo}" alt="profile"class="profile">
       <div>
       <p>${data.snippet.channelTitle}</p>
       <p class="grey">1.2M Subscribers</p>
      </div>
    </div>
    <button class="btn-sub">SUBSCRIBES</button>
   </div>
   <div class="discription">
    <p>${data.snippet.description}</p>
    <p class="grey">SHOW MORE</p>
    </div>`

    channelD.appendChild(channeldiv);
   
    }

  async function getchannelLogo(channelId) {

      const endpoint2=`${baseUrl}/channels?key=${Apikey}&id=${channelId}&part=snippet`;
      try{
          const response = await fetch(endpoint2);
          const result = await response.json();
          return result.items[0].snippet.thumbnails.high.url;
  
      }
      catch(error){
          alert("An error occured at fetching channel logo")
      }
    }
  function getDate(day){
    
    const date = new Date();
    const n=date.getMonth();
   return `${date.getDay()}/${n+1}/${date.getFullYear()} `

  }
  function caluclateUploadTime(publish){

    const currentDate = new Date();
    const publishDate =new Date(publish);
   
    let secondsGap = (currentDate.getTime()-publishDate.getTime())/1000;
   
    const secondsPerDay = 24 * 60 * 60;
    const secondsPerWeek = 7 * secondsPerDay;
    const secondsPerMonth = 30 * secondsPerDay;
    const secondsPerYear = 365 * secondsPerDay;
   
    if (secondsGap < secondsPerDay) {
      return `${Math.floor(secondsGap / (60 * 60))}hrs ago`;
    }
    if (secondsGap < secondsPerWeek) {
      return `${Math.floor(secondsGap / secondsPerDay)} days ago`;
    }
    if (secondsGap < secondsPerMonth) {
      return `${Math.floor(secondsGap / secondsPerWeek)} weeks ago`;
    }
    if(secondsGap < secondsPerYear) {
      return `${Math.floor(secondsGap / secondsPerMonth)} months ago`;
    }
   
    return `${Math.floor(secondsGap / secondsPerYear)} years ago`;
   
   }

   function converter(value){
    value= Number(value);
    if(value<1000){
        return `${value} `;
    }
    if(value<100000)
    {
       return `${Math.floor(value/1000)}k`
    }
    if(value<1000000)
    {
        return `${Math.floor(value/100000)}lakh`
    }
    return `${Math.floor(value/1000000)}M`
 }
//   <div>
//   <img src="./Assets/User-2.svg" alt="user"class="profile">
//   <div class="comment-left">
//       <b>Pavan Navde <span class="grey">8 hours ago</span></b>
//       <p>Wow, World full of different skills</p>
//       <div class="like-share">
//           <p><img src="./Assets/Button-Btn.svg" alt="like">1.17k</p>
//           <p><img src="./Assets/Button-Btn (1).svg" alt="dislike">632</p>
//           <p> reply</p>
//       </div>
//   </div>
// </div>