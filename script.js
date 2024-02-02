const baseUrl = "https://www.googleapis.com/youtube/v3";
const apiKey = "AIzaSyAqL36QbxefcuFV1X-FvxVi3LNCPnGsEqg";
const container= document.getElementById("video-container");
const searchElement = document.getElementById("search");
const searchbtn= document.getElementById("btn");
const menubtn=document.getElementById("menu");
const navBar= document.getElementById('nav-bar');
const loader = document.getElementById('loaderContainer')
const themeBtn = document.getElementById('themeBtn');

//theme changing functionality
themeBtn.addEventListener('change',()=>{
  if(localStorage.getItem("theme")=="light")
  {
    document.documentElement.setAttribute('data-theme','dark');
    localStorage.setItem('theme','dark')
  }
  else{
    document.documentElement.setAttribute('data-theme','light');
    localStorage.setItem('theme','light')
  }
})
//fetching initial videos for ui
window.addEventListener('load',()=>{
  FetchsearchResult("latest videos");
})
//calculating publish time with respective current time
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
//fetching channel details 
async function getchannelLogo(channelId) {

    const endpoint=`${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;
    try{
        const response = await fetch(endpoint);
        const result = await response.json();
        return result.items[0].snippet.thumbnails.high.url;

    }
    catch(error){
        console.log("An error occured at fetching channel logo")
    }
    

}

//fetching statistics of video
 async function getVideoStatistics(videoId){
   
    const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try{
        const response = await fetch(endpoint);
        const result = await response.json();
        return  result.items[0].statistics;
    }
    catch(error){
      console.log("An error occured in fetching statistics of video");
    }

 }

 //converting number in million, lakhs
 function converter(value){
    value= Number(value);
    if(value<1000){
        return `${value} views`;
    }
    if(value<100000)
    {
       return `${Math.floor(value/1000)}k views`
    }
    if(value<1000000)
    {
        return `${Math.floor(value/100000)}lakh views`
    }
    return `${Math.floor(value/1000000)}M Views`
 }
  
 //navigating home page to videoDetail page

 function navigateToVideoDetails(videoId){
  document.cookie = `id=${videoId}; path/videoDetail.html`;
  // document.cookie = `search=${searchElement.value}; path/videoDetail.html`;
   document.location = "https://pavannavde.github.io/YouTube-clone/videoDetail";
  //  document.location="http://127.0.0.1:5500/videoDetail.html"
 }

 //Rendering videos on UI

function renderOntoUI(videoList) {
    container.innerHTML="";
    videoList.forEach((video) => {
        const card = document.createElement("div");
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
       card.addEventListener("click",()=>{
        navigateToVideoDetails(video.id.videoId);
       });
        container.appendChild(card);
    });
  
}

//fetching search results on api 

async function FetchsearchResult(searchValue) {
  const endpoint = `${baseUrl}/search?key=${apiKey}&part=snippet&q=${searchValue}&maxResults=20`;
  try {
    const response = await fetch(endpoint);
    const Data = await response.json();

    for(let i=0;i<Data.items.length;i++)
    {
        let videoId = Data.items[i].id.videoId;
        let channelId = Data.items[i].snippet.channelId;

        let statistics = await getVideoStatistics(videoId);
        let channelLogo = await getchannelLogo(channelId);

       Data.items[i].statistics = statistics;
       Data.items[i].channelLogo = channelLogo;
  
    }
    //hide loader
    loader.style.display='none';
    renderOntoUI(Data.items);
  } catch (error) {
    console.log(`An error occured ${error}`);
  }
}

//eventListener for serach button
searchbtn.addEventListener("click",()=>{

    const searchString =searchElement.value;
    FetchsearchResult(searchString);

});
