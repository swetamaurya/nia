if (!localStorage.getItem("token")) {
  localStorage.clear();
  window.location.href = 'sign-in.html';
}
import { domain, LIVE_CLASS_APP_ID } from "./global/apis.js";

/********************************************
 *  Replace with your own details
 ********************************************/
const APP_ID = LIVE_CLASS_APP_ID;
const SERVER_URL = domain;
/********************************************/

let rtcClient;             // For audio/video
let remoteUid = null;      // Might store teacher’s UID if needed
let screenShareTrack = null;  // Teacher's screen-share
let cameraTrack = null;       // Teacher's camera

// Live class ID from local storage
let __id = localStorage.getItem("liveClassIdStart");

// Auto-start if we have a class ID
(function(){
  if (__id) {
    liveClassStart();
  } else {
    // localStorage.clear();
    // window.location.href = 'live-class-list.html';  
  }
})();

async function liveClassStart() {
  const channelName = __id;
  if (!channelName) {
    alert("Please enter a channel name!");
    return;
  }
  // Generate a random UID for the student
  const uid = String(Math.floor(Math.random() * 10000));
  await joinRTC(channelName, uid);
}

async function joinRTC(channelName, uid) {
  try {
    // 1. Get an RTC token from your server
    const role = "subscriber";
    const resp = await fetch(`${SERVER_URL}/rtc-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelName, uid, role }),
    });
    const data = await resp.json();
    const rtcToken = data.token;

    // 2. Create Agora client
    rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // 3. Handle teacher’s tracks
    rtcClient.on("user-published", handleUserPublished);
    rtcClient.on("user-unpublished", handleUserUnpublished);

    // 4. Join channel
    await rtcClient.join(APP_ID, channelName, rtcToken, uid);
    console.log("Student joined RTC channel:", channelName, "UID:", uid);
  } catch (error) {
    console.error("Failed to join RTC:", error);
  }
}

async function handleUserPublished(user, mediaType) {
  await rtcClient.subscribe(user, mediaType);
  console.log("Subscribed to user:", user.uid, "mediaType:", mediaType);

  remoteUid = user.uid; 

  if (mediaType === "audio" && user.audioTrack) {
    // Just play audio
    user.audioTrack.play();
    return;
  }

  if (mediaType === "video" && user.videoTrack) {
    // Heuristic to distinguish screen-share track vs. camera track
    const trackLabel = user.videoTrack
                          .getMediaStreamTrack()
                          .label.toLowerCase();

    if (trackLabel.includes("screen")) {
      // Screen-share track
      screenShareTrack = user.videoTrack;
      playScreenShare();
    } else {
      // Camera track
      cameraTrack = user.videoTrack;
      playCameraFeed();
    }
  }
}

function handleUserUnpublished(user, mediaType) {
  console.log("User unpublished:", user.uid, "mediaType:", mediaType);

  if (mediaType === "video") {
    // Check which track got unpublished
    const trackLabel = user.videoTrack?.getMediaStreamTrack()?.label?.toLowerCase() || "";

    // If it's the screen-share track
    if (screenShareTrack && trackLabel.includes("screen")) {
      screenShareTrack.stop();
      screenShareTrack.close();
      screenShareTrack = null;

      // Clear main stream
      clearMainStream();

      // If camera is still active, show it
      if (cameraTrack) {
        playCameraFeed();
      }
    }
    // If it's the camera track
    else if (cameraTrack && !trackLabel.includes("screen")) {
      cameraTrack.stop();
      cameraTrack.close();
      cameraTrack = null;

      // If no screen-share remains, clear the main container
      if (!screenShareTrack) {
        clearMainStream();
      }
      hideCameraBox();
    }
  }
}

// ========== Helper functions ==========

// Show screen-share in the main container
function playScreenShare() {
  if (!screenShareTrack) return;
  screenShareTrack.play("main-stream");

  // If camera track also exists, show it in the small corner
  if (cameraTrack) {
    showCameraBox();
    cameraTrack.play("teacher-camera-container");
  }
}

// Show camera track in main container (if no screen-share),
// or in small box if screen-share is active
function playCameraFeed() {
  if (!screenShareTrack) {
    // No screen-share, so camera goes full in main-stream
    cameraTrack.play("main-stream");
    hideCameraBox();
  } else {
    // Screen-share is active, so keep it in main,
    // and move camera to the small corner container
    screenShareTrack.play("main-stream");
    showCameraBox();
    cameraTrack.play("teacher-camera-container");
  }
}

// Clear the main container (stop/hide existing video)
function clearMainStream() {
  const mainElem = document.getElementById("main-stream");
  mainElem.innerHTML = "";
}

// Display the small camera box
function showCameraBox() {
  const camBox = document.getElementById("teacher-camera-container");
  camBox.style.display = "block";
  camBox.innerHTML = "";
}

// Hide the small camera box
function hideCameraBox() {
  const camBox = document.getElementById("teacher-camera-container");
  camBox.style.display = "none";
  camBox.innerHTML = "";
}