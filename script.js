/*
    Author: Muhammad iar Hossain
    Date of creation: 8th December 2023
    Used Technology: HTML5, CSS3, Vanilla JS
    compatiable for all major web browser 
    Features: 
      => Play next / previous audio
      => Play random audio
      => Loop playlist / single song 
      => Play / pause audio 
      => Highlight playing song 
      => Get audio file dynamically
      => Forward and backward duration through progressbar
      => Keyboard navigation 
      */
"use strict";
import audioTrackObject from "./musicList.js"
// all required variable
const mainAudio = document.getElementById("main_audio"),
  allTrackList = document.querySelector(".all_track_list"),
  favoriteList = document.querySelector(".favorite_list"),
  audioTrackContainer = document.querySelector(".audio_track_container"),
  favoriteTrackContainer = document.querySelector(".favorite_track_container"),
  favoriteBtn = document.querySelector("#fav_icon"),
  trackPlayerTray = document.querySelector(".track_player_tray"),
  audioTimelineTrack = document.querySelector(".audio_timeline_track"),
  closeBtn = document.querySelector(".close_btn"),
  keyboardShortcutPane = document.querySelector(".keyboard_shortcut_pane"),
  kbdShortcutBtn = document.querySelector(".kbd_shortcut_btn"),
  dismissBtn = document.querySelector(".dismiss_btn"),
  activeTrackCover = document.getElementById("active_track_cover"),
  trackNameSlider = document.querySelector(".track_name_slider"),
  activeTracksTitle = document.querySelectorAll(".active_track_title"),
  audioDurationBegin = document.querySelector(".audio_duration_begin"),
  audioDurationEnd = document.querySelector(".audio_duration_end"),
  randomBtn = document.querySelector(".random_btn"),
  loopBtn = document.querySelector(".loop_btn"),
  prevBtns = document.querySelectorAll(".prev_btn"),
  playOrPauseBtns = document.querySelectorAll(".play_pause_btn"),
  nextBtns = document.querySelectorAll(".next_btn");

// audioTrackObject comes from musicList.js
// generate each audio track item div sent audio related info example: Audio title, Audio image
audioTrackObject.forEach((obj, index) => {
  audioTrackContainer.innerHTML += `
    <div class="audio_track_item d-flex" data-title="${obj.trackTitle}" data-img="${obj.img}" data-url="${obj.url}" tabindex="${index + 1}">
      <figure>
        <img src="${obj.img}" alt="track image">
      </figure>
      <p class="track_label">${obj.trackTitle}</p>
    </div>`;
});
// When window loaded get random audio from audioTrackObject
let audioIndex = Math.floor(Math.random() * (audioTrackObject.length - 1) + 1);
const audioTrackItems = document.querySelectorAll(".audio_track_item");

// adding default audio
window.onload = () => {
  mainAudio.src = audioTrackObject[audioIndex].url;
  activeTrackCover.src = audioTrackObject[audioIndex].img;
  activeTracksTitle[0].innerText = audioTrackObject[audioIndex].trackTitle;
  activeTracksTitle[1].innerText = audioTrackObject[audioIndex].trackTitle;
};
// make each audio track item div workable and play coresponding audio
audioTrackItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    playSong(item, index);
  });
  audioTrackItems[0].focus()
});

// all event handler
trackPlayerTray.addEventListener("click", openTray);
closeBtn.addEventListener("click", closeTray);

randomBtn.addEventListener("click", playRandomSong);
prevBtns.forEach((btn) => {
  btn.addEventListener("click", playPrevSong);
});
nextBtns.forEach((btn) => {
  btn.addEventListener("click", playNextSong);
});
playOrPauseBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    playOrPauseSong(index);
  });
});
favoriteBtn.addEventListener('click', addToFavoriteList);
allTrackList.addEventListener("click", showAllTrackList);
favoriteList.addEventListener("click", showFavoriteTrackList);
audioTimelineTrack.addEventListener("click", updateTrackTimeLine);
loopBtn.addEventListener("click", musicLoop);
mainAudio.addEventListener("timeupdate", updateAudioTimeLine);
mainAudio.addEventListener("ended", mainAudioEndEvent);
kbdShortcutBtn.addEventListener("click", showShortCutpane);
dismissBtn.addEventListener("click", hideShortCutpane);

// play audio when audioTrackItems div clicked
function playSong(item, index) {
  audioIndex = index;
  addOrRemoveClass(item);
  reversePlayBtn(0);
  getAudioInfo(item);
}
// play previous song of audioTrackObject. when prevBtn clicked.
function playPrevSong() {
  let trackItem;
  audioIndex -= getRandomNumber();
  if (audioIndex < 0) {
    audioIndex = audioTrackItems.length - 1;
    trackItem = audioTrackItems[audioIndex];
    addOrRemoveClass(trackItem);
    getAudioInfo(trackItem);
  } else {
    trackItem = audioTrackItems[audioIndex];
    addOrRemoveClass(trackItem);
    getAudioInfo(trackItem);
    reversePlayBtn(0);
  }
}
// play next song of audioTrackObject. when prevBtn clicked.
function playNextSong() {
  let trackItem;
  audioIndex += getRandomNumber();
  if (audioIndex >= audioTrackItems.length) {
    audioIndex = 0;
    trackItem = audioTrackItems[audioIndex];
    addOrRemoveClass(trackItem);
    getAudioInfo(trackItem);
  } else {
    trackItem = audioTrackItems[audioIndex];
    addOrRemoveClass(trackItem);
    getAudioInfo(trackItem);
    reversePlayBtn(0);
  }
}
// make workable play and pause btn.
function playOrPauseSong(index) {
  const inverse = playOrPauseBtns[Number(!index)],
    trackItem = audioTrackItems[audioIndex];
  if (playOrPauseBtns[index].innerText == "pause_circle" && inverse) {
    playOrPauseBtns[index].innerText = "play_circle";
    inverse.innerText = "play_circle";
    mainAudio.pause();
    addOrRemoveClass(trackItem);
  } else {
    playOrPauseBtns[index].innerText = "pause_circle";
    inverse.innerText = "pause_circle";
    mainAudio.play();
    addOrRemoveClass(trackItem);
  }
}
function addToFavoriteList() {
  let activeClass = audioTrackContainer.querySelector('.active');
  if (activeClass) {
    let audioTrackDataset = activeClass.dataset;
    favoriteTrackContainer.innerHTML += `
      <div class="audio_track_item d-flex" data-title="${audioTrackDataset.title}" data-img="${audioTrackDataset.img}" data-url="${audioTrackDataset.url}">
        <figure>
          <img src="${audioTrackDataset.img}" alt="track image">
        </figure>
        <p class="track_label">${audioTrackDataset.title}</p>
      </div>
    `
    let favoriteSongItems = favoriteTrackContainer.querySelectorAll('.audio_track_item')
    favoriteSongItems.forEach((song, i) => {
      song.addEventListener('click', () => {
        playSong(song, i)
      })
    })
  }
}

// make randomBtn active / inactive
function playRandomSong() {
  randomBtn.classList.toggle("active");
}
// Html file has two play_pause_btn. if user clicked play_pause_btn1 then change also play_pause_btn2 icon at the same time
function reversePlayBtn(index) {
  const inverse = playOrPauseBtns[Number(!index)],
    trackItem = audioTrackItems[audioIndex];
  if (playOrPauseBtns[index].innerText == "play_circle" && inverse) {
    playOrPauseBtns[index].innerText = "pause_circle";
    inverse.innerText = "pause_circle";
    mainAudio.play();
    addOrRemoveClass(trackItem);
  }
}
// open and close trackPlayerTray
function openTray(e) {
  if (
    e.target == activeTracksTitle[1] ||
    e.target == trackNameSlider ||
    e.target == activeTrackCover
  ) {
    this.classList.add("expand");
  }
}
function closeTray() {
  trackPlayerTray.classList.remove("expand");
}
// get Html audio media info such as currentTime, duration
function updateAudioTimeLine(e) {
  const currTime = e.target.currentTime,
    duration = e.target.duration || 0,
    progressWidth = (currTime / duration) * 100;
  let currentMin = Math.floor(currTime / 60),
    currentSec = Math.floor(currTime % 60),
    totalMin = Math.floor(duration / 60),
    totalSec = Math.floor(duration % 60);
  audioTimelineTrack.style.setProperty("--audioTimeLineWidth", progressWidth);
  currentMin = leadingZero(currentMin);
  currentSec = leadingZero(currentSec);
  audioDurationBegin.innerText = `${currentMin}:${currentSec}`;
  totalMin = leadingZero(totalMin);
  totalSec = leadingZero(totalSec);
  audioDurationEnd.innerText = `${totalMin}:${totalSec}`;
}
// Audio forward or backward based on clicked area
function updateTrackTimeLine(e) {
  let width = e.target.offsetWidth,
    clickedOffsetX = e.offsetX,
    songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / width) * songDuration;
  reversePlayBtn(0);
}
// change loopBtn icon
function musicLoop() {
  const icon = loopBtn.innerText;
  if (icon == "repeat_one") {
    loopBtn.innerText = "repeat";
    loopBtn.setAttribute("title", "Loop playlist");
  } else {
    loopBtn.innerText = "repeat_one";
    loopBtn.setAttribute("title", "Loop this song");
  }
}
// add functionality based on loaded icon
function mainAudioEndEvent() {
  const icon = loopBtn.innerText;
  if (icon == "repeat_one") {
    mainAudio.currentTime = 0;
    playSong(audioTrackItems[audioIndex], audioIndex);
  } else {
    playNextSong();
  }
}
function showAllTrackList() {
  audioTrackContainer.style.display = "block";
  favoriteTrackContainer.style.display = "none";
  this.nextElementSibling.classList.remove('active');
  this.classList.add('active');
}
function showFavoriteTrackList() {
  audioTrackContainer.style.display = "none";
  favoriteTrackContainer.style.display = "block";
  this.previousElementSibling.classList.remove('active');
  this.classList.add('active');
}
// keyboard navigator
document.addEventListener("keydown", (e) => {
  /*  if (!keyboardShortcutPane.classList.contains("show")) {
     e.key === "e" ? trackPlayerTray.classList.add("expand") : e.key === "Escape"? trackPlayerTray.classList.remove("expand")
       : e.code === "Space"
       ? playOrPauseSong(1)
       : e.key === "ArrowRight"
       ? playNextSong()
       : e.key === "ArrowLeft"
       ? playPrevSong()
       : null;
   } */
  if (!keyboardShortcutPane.classList.contains("show")) {
    if (e.key === "e") {
      trackPlayerTray.classList.add("expand");
    } else if (e.key === "Escape") {
      trackPlayerTray.classList.remove("expand");
    } else if (e.code === "Space") {
      playOrPauseSong(1);
    } else if (e.key === "ArrowRight") {
      playNextSong();
    } else if (e.key === "ArrowLeft") {
      playPrevSong();
    }
  }
  if (trackPlayerTray.classList.contains("expand")) {
    e.key === "s" ? playRandomSong() : e.key === "r" ? musicLoop() : null;
  }
});
// keyboard shortcut details
function showShortCutpane() {
  keyboardShortcutPane.classList.add("show");
}
function hideShortCutpane() {
  keyboardShortcutPane.classList.remove("show");
}
// utility function
function getAudioInfo(item) {
  const audioTitle = item.getAttribute("data-title");
  const audioUrl = item.getAttribute("data-url");
  const coverImg = item.getAttribute("data-img");
  activeTracksTitle[0].innerText = audioTitle;
  activeTracksTitle[1].innerText = audioTitle;
  activeTrackCover.src = coverImg;
  mainAudio.src = audioUrl;
  mainAudio.play();
}
function addOrRemoveClass(item) {
  const findClass = audioTrackContainer.querySelector(".active") || favoriteTrackContainer.querySelector('.active');
  if (!item.classList.contains("active") && findClass) {
    findClass.classList.remove("active");
  }
  item.classList.add("active");
}
function getRandomNumber() {
  if (randomBtn.classList.contains("active")) {
    return Math.floor(Math.random() * (audioTrackItems.length - 1) + 1);
  }
  return 1;
}
function leadingZero(v) {
  return v < 10 ? `0${v}` : v;
}