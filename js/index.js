console.log("javascript is here")
let currentsong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    try {
        currFolder=folder;
        let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
         songs = [];

        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("]")[1]);
                
            }
        }

        // show all the songs
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>  <img src="img/music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Aiyaz</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="img/play.svg" class="invert" alt="">
                            </div> </li>`;

    }
    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
    return songs
}

const playMusic = (track, pause = false) => {
    //let audio=new Audio("/songs/" + track);
    
    currentsong.src = `/${currFolder}/[SPOTIFY-DOWNLOADER.COM]` + track
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg"
       
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00"
     // Add event listener for when the current song ends
     currentsong.addEventListener('ended', () => {
        let index = songs.indexOf(currentsong.src.split("]")[1]);
        if (index + 1 < songs.length) {
            // Play the next song
            playMusic(songs[index + 1]);
        }
    });
    //  let index=songs.indexOf(currentsong.src.split("]")[1])
    //     if(currentsong.currentTime == currentsong.duration && index+1<songs.length){
    //         playMusic(songs[index+1])
    //     }
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors=div.getElementsByTagName("a")
        let cardcontainer=document.querySelector(".cardcontainer")
       let array = Array.from(anchors)
       for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
       
            if(e.href.includes("/songs")){
                let folder=e.href.split("/").slice(-2)[0]
                
                let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
                let response = await a.json();
                cardcontainer.innerHTML=cardcontainer.innerHTML + `  <div data-folder=${folder} class="card">
                <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

            }
        }

        // load the playlist of folder
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
        
    })


}
async function main() {

    // get the list of all songs
    await getSongs("songs/mohitchauhan")
    playMusic(songs[0], true)
    
    // Display all the albums
    displayAlbums();

   

    // attach an event listener to play ,next and previous 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    previous.addEventListener("click", () => {    
        let index=songs.indexOf(currentsong.src.split("]")[1])
        if(index > 0){
            playMusic(songs[index-1])
        } 
    })

    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src.split("]")[1])
        if(index+1 < songs.length){
            playMusic(songs[index+1])
        }
    })

    // listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    // event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    })
    // event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // Event listener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume=parseInt(e.target.value)/100
        if(currentsong.volume > 0){
            document.querySelector(".vol>img").src=document.querySelector(".vol>img").src.replace("mute.svg","volume.svg")
        }
        if(currentsong.volume == 0){
            document.querySelector(".vol>img").src=document.querySelector(".vol>img").src.replace("volume.svg","mute.svg")
        }
    })

    // event listener to mute
    document.querySelector(".vol>img").addEventListener("click",(e)=>{
       
        console.log(e.target.src)
        if(e.target.src.includes("volume.svg")){
            currentsong.volume=0
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
            currentsong.pause()
            play.src = "img/play.svg"
        }
        else {
            currentsong.volume=0.1
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
            currentsong.play();
            play.src = "img/pause.svg"
        }
    })
    

}
main()