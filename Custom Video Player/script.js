const container =document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeButton = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
currentVideoTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseButton = container.querySelector(".play-pause i"),
speedButton = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
picInPicButton = container.querySelector(".pic_in_pic span");
fullScreenButton = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
    if(mainVideo.paused)return
    timer = setTimeout(()=>{
        container.classList.remove('show-controls')
    },3000)
}
hideControls()
container.addEventListener('mousemove',() => {
    container.classList.add('show-controls')
    clearTimeout(timer)
    hideControls()
})
const formatTime = time =>{
    let seconds = Math.floor(time % 60),
    minutes = Math.floor (time/60)%60,
    hours = Math.floor (time/3600);

    seconds = seconds<10 ?`0${seconds}` : seconds;
    minutes = minutes<10 ?`0${minutes}` : minutes;
    hours = hours<10 ?`0${hours}`: hours;

    if(hours == 0 ) {
        return `${hours}:${minutes}:${seconds}`
    }
}
mainVideo.addEventListener("timeupdate",e =>{
  let {currentTime,duration} = e.target;
  let percent = (currentTime / duration)*100;
  progressBar.style.width = `${percent}%`;
  currentVideoTime.innerText = formatTime(currentTime) 
});
mainVideo.addEventListener('loadeddata', e => {
    videoDuration.innerText = formatTime(e.target.duration)
})

videoTimeline.addEventListener('click',e  =>{
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
});
const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth
    progressBar.style.width = `${e.offsetX}px`
    mainVideo.currentTime = (e.offsetX/timelineWidth) * mainVideo.duration
    currentVideoTime.innerText = formatTime(mainVideo.currentTime)
}
videoTimeline.addEventListener('mousedown', () => {
    videoTimeline.addEventListener('mousemove',draggableProgressBar)
})
container.addEventListener('mouseup', ()=> {
    videoTimeline.removeEventListener('mousemove',draggableProgressBar)
   
})
videoTimeline.addEventListener('mousemove', e => {
    const progressTime = videoTimeline.querySelector("span")
    let offsetX = e.offsetX
    progressTime.style.left = `${offsetX}px`
    let timelineWidth=videoTimeline.clientWidth
    let percent = (e.offsetX/timelineWidth)*mainVideo.duration
    progressTime.innerText= formatTime(percent)
})
volumeButton.addEventListener("click",()=>{
    if(!volumeButton.classList.contains("fa-volume-high")){
        mainVideo.volume = 0.5;
        volumeButton.classList.replace("fa-volume-xmark","fa-volume-high")
    } else {
        mainVideo.volume = 0.0;
        volumeButton.classList.replace("fa-volume-high","fa-volume-xmark")
    }
    volumeSlider.value = mainVideo.volume;
});
volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0){
        volumeButton.classList.replace("fa-volume-high","fa-volume-xmark");
    } else {
        volumeButton.classList.replace("fa-volume-xmark","fa-volume-high");
    }
});
speedButton.addEventListener("click",()=>{
    speedOptions.classList.toggle("show");
});
speedOptions.querySelectorAll("li").forEach(option =>{
    option.addEventListener("click", () =>{
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});
document.addEventListener("click", e =>{
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-icons"){
        speedOptions.classList.remove("show");
    }
});
picInPicButton.addEventListener("click",()=>{
    mainVideo.requestPictureInPicture();
    
}); 
fullScreenButton.addEventListener("click",()=>{
    container.classList.toggle("fullscreen")
    if(document.fullscreenElement){
        fullScreenButton.classList.replace("fa-compress","fa-expand");
        return document.exitFullscreen();
    }
    fullScreenButton.classList.replace("fa-expand","fa-compress");
    container.requestFullscreen();
});
skipBackward.addEventListener("click",()=>{
    mainVideo.currentTime -= 5;
});
skipForward.addEventListener("click",()=>{
    mainVideo.currentTime += 5;
});
playPauseButton.addEventListener("click", () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});
mainVideo.addEventListener("play", () =>{
    playPauseButton.classList.replace("fa-play","fa-pause");
});
mainVideo.addEventListener("pause", () =>{
    playPauseButton.classList.replace("fa-pause","fa-play");
});
