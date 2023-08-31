const baseUrl = "https://www.googleapis.com/youtube/v3";
const apiKey = "AIzaSyAB0-iky5uGJoqxkeLjr607mfUfEYsSnSM";
const container= document.getElementById("video-container");
const searchElement = document.getElementById("search");
const searchbtn= document.getElementById("btn");

//  <div class="video-card">
//        <div class="top">
//            <img src="./Assets/Images.svg" alt="thumbnail">
//        </div>
//        <div class="Bottom">
//            <div>
//                <img src="./Assets/User-1.svg" alt="profile">
//            </div>
//            <div class="text">
//                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//                <p class="Cinfo">James Gouse <br> 15k Views. 1 week Ago</p>
//            </div>
//        </div>
//     </div>


//  {
//     "kind": "youtube#searchResult",
//     "etag": "Dn_HjQZj7iXCRkRlNQXL3xxXTxE",
//     "id": {
//         "kind": "youtube#video",
//         "videoId": "_O_9HUZvJK4"
//     },
//     "snippet": {
//         "publishedAt": "2023-07-31T13:18:46Z",
//         "channelId": "UCJsApDpIBPpRRg0n9ZVmKAQ",
//         "title": "Weather obsession of Bangalore people📈🤣 #shorts #ahmedmasood #bangalore #ytshorts",
//         "description": "",
//         "thumbnails": {
//             "default": {
//                 "url": "https://i.ytimg.com/vi/_O_9HUZvJK4/default.jpg",
//                 "width": 120,
//                 "height": 90
//             },
//             "medium": {
//                 "url": "https://i.ytimg.com/vi/_O_9HUZvJK4/mqdefault.jpg",
//                 "width": 320,
//                 "height": 180
//             },
//             "high": {
//                 "url": "https://i.ytimg.com/vi/_O_9HUZvJK4/hqdefault.jpg",
//                 "width": 480,
//                 "height": 360
//             }
//         },
//         "channelTitle": "Ahmed Masood",
//         "liveBroadcastContent": "none",
//         "publishTime": "2023-07-31T13:18:46Z"
//     },
//     "statistics" :
// }


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

async function getchannelLogo(channelId) {

    const endpoint=`${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;
    try{
        const response = await fetch(endpoint);
        const result =response.json();
        return result.items[0].snippet.thumbnails.high.url;

    }
    catch(error){
        alert("An error occured at fetching channel logo")
    }
    

}

 async function getVideoStatistics(videoId){
   
    const endpoint = `${baseUrl}/videos?key=${apiKey}&id=${videoId}&part=statistics`;
    try{
        const response = await fetch(endpoint);
        const result = await response.json();
        return  result.items[0].statistics;
    }
    catch(error){
      alert("An error occured in fetching statstics of video");
    }

 }
 function converter(value){
    if(value<1000){
        return `${value} views`;
    }
    if(value<100000)
    {
       return `${value/1000}k views`
    }
    if(value<1000000)
    {
        return `${value/100000}lakh views`
    }
    return `${value/1000000}M Views`
 }

function renderOntoUI(videoList) {
    container.innerHTML="";
    videoList.forEach((video) => {
        let card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `<div class="top">
                      <img src="${video.snippet.thumbnails.high.url}" alt="thumbnail">
                     </div>
                    <div class="Bottom">
                      <div>
                        <img src="${video.channelLogo}" alt="profile">
                   </div>
                 <div class="text">
                     <p>${video.snippet.title}.</p>
                     <p class="Cinfo">${video.snippet.channelTitle} <br> ${ converter(video.statistics.viewCount)} .${caluclateUploadTime(video.snippet.publishTime)}</p>
                 </div>
             </div>`;

        container.appendChild(card);
    });
  
}

async function FetchsearchResult(searchValue) {
  const endpoint = `${baseUrl}/search?key=${apiKey}&part=snippet&q=${searchValue}&maxResults=20`;
  try {
    const response = await fetch(endpoint);
    const Data = await response.json();

    for(let i=0;i<Data.items.lenght;i++)
    {
        let videoId = Data.items[i].id.videoId;
        let channelId = Data.items[i].snippet.channelId;

        let statistics = await getVideoStatistics(videoId);
        let channelLogo = await getchannelLogo(channelId);

       result.items[i].statistics = statistics;
       result.items[i].channelLogo = channelLogo;
  
    }
    
    renderOntoUI(Data.items);
  } catch (error) {
    alert(`An error occured ${error}`);
  }
}

searchbtn.addEventListener("click",()=>{

    const searchString =searchElement.value;
    FetchsearchResult(searchString);

});
FetchsearchResult("");