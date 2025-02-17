// Redirect to sign-in if no token exists
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

// For the student, let Agora assign a UID (using null)
const appId = APP_ID;
const uid = null;

// Create an Agora client (subscriber)
let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

// DOM element references
const remoteCameraDiv = document.getElementById("remote-camera");
const remoteScreenDiv = document.getElementById("remote-screen");
const remoteScreenContainer = document.getElementById("remote-screen-container");

// Flags to track teacher stream availability
// (Teacher uses fixed UIDs: 1001 for camera, 1002 for screen)
let teacherCameraActive = false;
let teacherScreenActive = false;

// Fetch token from the server
async function getToken(channel, uid) {
  try {
    const response = await fetch(`${SERVER_URL}/rtcToken?channel=${channel}&uid=${uid || 0}`);
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

/**
 * Update the student layout based on available teacher streams:
 *
 * - If both teacher screen and camera streams are active:
 *    • The teacher screen (#remote-screen) is shown full width (100% × 500px).
 *    • The teacher camera (#remote-camera) is overlaid at the bottom–right.
 *
 * - If only the teacher camera is active:
 *    • The teacher camera is displayed full width (by overriding its styles).
 *
 * - If only the teacher screen is active:
 *    • The teacher screen is shown full width.
 *
 * - If neither stream is active, both containers are hidden.
 */
function updateLayoutStudent() {
  if (teacherCameraActive && teacherScreenActive) {
    // Both streams active: show teacher screen and overlay teacher camera
    remoteScreenDiv.classList.remove("hidden");
    remoteCameraDiv.classList.remove("hidden");
    // Remove any inline style overrides (use default overlay styling)
    remoteCameraDiv.style.position = "";
    remoteCameraDiv.style.width = "";
    remoteCameraDiv.style.height = "";
  } else if (teacherCameraActive && !teacherScreenActive) {
    // Only teacher camera active: show teacher camera as full stream
    remoteCameraDiv.classList.remove("hidden");
    remoteScreenDiv.classList.add("hidden");
    // Override styling so that the camera fills the container
    remoteCameraDiv.style.position = "relative";
    remoteCameraDiv.style.width = "100%";
    remoteCameraDiv.style.height = "500px";
  } else if (teacherScreenActive && !teacherCameraActive) {
    // Only teacher screen active: show teacher screen as full stream
    remoteScreenDiv.classList.remove("hidden");
    remoteCameraDiv.classList.add("hidden");
  } else {
    // Neither stream active: hide both containers
    remoteScreenDiv.classList.add("hidden");
    remoteCameraDiv.classList.add("hidden");
  }
}

// Immediately join the channel (using live class ID stored in localStorage)
(async function () {
  const channel = localStorage.getItem("liveClassIdStart");
  if (!channel) {
    console.error("No live class ID found in localStorage.");
    return;
  }
  const token = await getToken(channel, uid);
  if (!token) {
    console.error("Failed to retrieve token.");
    return;
  }
  await client.join(appId, channel, token, uid);
})();

// Subscribe to remote streams published by the teacher
client.on("user-published", async (user, mediaType) => {
  await client.subscribe(user, mediaType);
  console.log("Subscribed to user:", user.uid);

  if (mediaType === "video") {
    if (user.uid === 1001) {
      // Teacher camera stream
      teacherCameraActive = true;
      user.videoTrack && user.videoTrack.play(remoteCameraDiv);
    } else if (user.uid === 1002) {
      // Teacher screen share stream
      teacherScreenActive = true;
      user.videoTrack && user.videoTrack.play(remoteScreenDiv);
    }
  }
  if (mediaType === "audio") {
    user.audioTrack && user.audioTrack.play();
  }
  updateLayoutStudent();
});

// When a teacher stream is unpublished, update the layout accordingly
client.on("user-unpublished", (user, mediaType) => {
  if (mediaType === "video") {
    if (user.uid === 1001) {
      teacherCameraActive = false;
      remoteCameraDiv.innerHTML = "";
    } else if (user.uid === 1002) {
      teacherScreenActive = false;
      remoteScreenDiv.innerHTML = "";
    }
  }
  updateLayoutStudent();
});

// Clean up if a teacher leaves the channel
client.on("user-left", (user) => {
  if (user.uid === 1001) {
    teacherCameraActive = false;
    remoteCameraDiv.innerHTML = "";
  } else if (user.uid === 1002) {
    teacherScreenActive = false;
    remoteScreenDiv.innerHTML = "";
  }
  updateLayoutStudent();
});
