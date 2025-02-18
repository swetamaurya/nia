 if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'sign-in.html';
}
import { CLASS_UPDATE_API, domain, LIVE_CLASS_APP_ID } from "./global/apis.js";

/********************************************
  ********************************************/
const APP_ID = LIVE_CLASS_APP_ID;
const SERVER_URL = domain;

 const teacherCameraUid = 1001;
const teacherScreenUid = 1002;

// ========= RTC Setup with 2 Clients =========
 let mainClient;
let localTracks = {
    videoTrack: null,
    audioTrack: null
};
let isMainPublished = false;

 let screenClient;
let screenTrack = null;
let isScreenPublished = false;

// For session timer and student count
let timerDiv = document.getElementById("timer");
let studentCountDiv = document.getElementById("student-count");
let startTime = null;
let timerInterval = null;

// For counting remote students (ignore teacher UIDs)
let remoteUsers = {};

// Update layout based on active streams (existing functionality)
function updateLayoutTeacher() {
  if (isScreenPublished && screenTrack) {
    document.body.classList.add("screensharing");
  } else {
    document.body.classList.remove("screensharing");
  }
}

// Update session timer display
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  timerDiv.innerText = `Session Timer: ${hours}:${minutes}:${seconds}`;
}

// Update student count display
function updateStudentCount() {
  const count = Object.keys(remoteUsers).length;
  studentCountDiv.innerText = `Total Students Live: ${count}`;
}

// Live class ID localStorage से
let __id = localStorage.getItem("liveClassIdStart");

(function(){
    if(localStorage.getItem("liveClassIdStart")){
        liveClassStart();
    } else {
        // localStorage.clear();
        // window.location.href = 'sign-in.html';  
    }
})();

// =========== Start Button (Camera & Mic) ===========
async function liveClassStart(){
    if (isMainPublished) {
        alert("Already streaming camera!");
        return;
    }
    const channelName = __id;
    if (!channelName) {
        alert("Please enter a channel name first!");
        return;
    }
     let rtcTokenCamera;
    try {
        const resp = await fetch(`${SERVER_URL}/rtcToken?channel=${channelName}&uid=${teacherCameraUid}`);
        const data = await resp.json();
        rtcTokenCamera = data.token;
    } catch (err) {
        console.error("Failed to get RTC token for camera:", err);
        return;
    }
    try {
        mainClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        await mainClient.join(APP_ID, channelName, rtcTokenCamera, teacherCameraUid);

         const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracks.audioTrack = micTrack;
        localTracks.videoTrack = camTrack;

         localTracks.videoTrack.play("teacher-stream");

         await mainClient.publish([micTrack, camTrack]);
        isMainPublished = true;
        updateLayoutTeacher();

        // Start session timer
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);

        // Listen for remote student events on clientCamera
        mainClient.on("user-joined", (user) => {
            if (user.uid !== teacherCameraUid && user.uid !== teacherScreenUid) {
                remoteUsers[user.uid] = user;
                updateStudentCount();
            }
        });
        mainClient.on("user-left", (user) => {
            if (remoteUsers[user.uid]) {
                delete remoteUsers[user.uid];
                updateStudentCount();
            }
        });
    } catch (err) {
        console.error("Error starting main stream:", err);
    }
};

// ========== Stop Button (Stop All Streaming) ===========
let stopBtnEventListener = document.getElementById("stopBtn");
stopBtnEventListener.addEventListener("click", async function(){
    localStorage.removeItem("liveClassIdStart");
    liveClassStop();
    
    let API = `${CLASS_UPDATE_API}`;
    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            "_id": __id,
            "liveClassStatus":"false"
        })
    });
});

async function liveClassStop(){
     if (isMainPublished && mainClient) {
        try {
            await mainClient.unpublish();
            if (localTracks.videoTrack) {
                localTracks.videoTrack.stop();
                localTracks.videoTrack.close();
                localTracks.videoTrack = null;
            }
            if (localTracks.audioTrack) {
                localTracks.audioTrack.stop();
                localTracks.audioTrack.close();
                localTracks.audioTrack = null;
            }
            await mainClient.leave();
            mainClient = null;
            isMainPublished = false;
        } catch (err) {
            console.error("Error stopping main stream:", err);
        }
    }
     if (isScreenPublished && screenClient) {
        try {
            await screenClient.unpublish(screenTrack);
            if (screenTrack) {
                screenTrack.stop();
                screenTrack.close();
                screenTrack = null;
            }
            await screenClient.leave();
            screenClient = null;
            isScreenPublished = false;
        } catch (err) {
            console.error("Error stopping screen share:", err);
        }
    }
    document.getElementById("teacher-stream").innerHTML = "";
    document.getElementById("screen-stream").innerHTML = "";
    document.body.classList.remove("screensharing");

    clearInterval(timerInterval);
    timerDiv.innerText = "Session Timer: 00:00:00";

    remoteUsers = {};
    updateStudentCount();
    updateLayoutTeacher();
}

// ========== Screen Share ON ==========
document.getElementById("screenShareBtn").addEventListener("click", async function() {
    screenShareOnBtnFun();
    document.getElementById("screenShareBtn").classList.add("d-none");
    document.getElementById("screenShareOffBtn").classList.remove("d-none");
});

async function screenShareOnBtnFun (){
    if (!isMainPublished) {
        alert("Please start camera streaming first!");
        return;
    }
    if (isScreenPublished) {
        alert("Screen share already active!");
        return;
    }
    const channelName = __id;
    if (!channelName) {
        alert("Enter channel name first!");
        return;
    }
     let rtcTokenScreen;
    try {
        const resp = await fetch(`${SERVER_URL}/rtcToken?channel=${channelName}&uid=${teacherScreenUid}`);
        const data = await resp.json();
        rtcTokenScreen = data.token;
    } catch (err) {
        console.error("Failed to get RTC token for screen share:", err);
        return;
    }
    try {
        screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        await screenClient.join(APP_ID, channelName, rtcTokenScreen, teacherScreenUid);
        screenTrack = await AgoraRTC.createScreenVideoTrack();
        await screenClient.publish(screenTrack);
        isScreenPublished = true;
        document.body.classList.add("screensharing");
        screenTrack.play("screen-stream");
        updateLayoutTeacher();
    } catch (err) {
        console.error("Error starting screen share:", err);
    }
};

// ========== Screen Share OFF ==========
document.getElementById("screenShareOffBtn").addEventListener("click", async function(){
    screenShareOffFunction();
    document.getElementById("screenShareBtn").classList.remove("d-none");
    document.getElementById("screenShareOffBtn").classList.add("d-none");
});

async function screenShareOffFunction(){
    if (!isScreenPublished || !screenClient || !screenTrack) {
        alert("No active screen share!");
        return;
    }
    try {
        await screenClient.unpublish(screenTrack);
        screenTrack.stop();
        screenTrack.close();
        screenTrack = null;
        await screenClient.leave();
        screenClient = null;
        isScreenPublished = false;
        document.body.classList.remove("screensharing");
        document.getElementById("screen-stream").innerHTML = "";
        updateLayoutTeacher();
    } catch (err) {
        console.error("Error stopping screen share:", err);
    }
};

// ========== Video OFF (Camera) ==========
document.getElementById("videoOffBtn").addEventListener("click", async function(){
    videoOffBtnFunction();
    document.getElementById("videoOffBtn").classList.add("d-none");
    document.getElementById("videoOnBtn").classList.remove("d-none");
});
async function videoOffBtnFunction(){
    if (!localTracks.videoTrack) {
        alert("Camera track not found!");
        return;
    }
    try {
        await localTracks.videoTrack.setEnabled(false);
        console.log("Camera is OFF now.");
    } catch (err) {
        console.error("Failed to turn off camera:", err);
    }
};

// ========== Video ON (Camera) ==========
document.getElementById("videoOnBtn").addEventListener("click", async function(){
    videoOnBtnFun();
    document.getElementById("videoOnBtn").classList.add("d-none");
    document.getElementById("videoOffBtn").classList.remove("d-none");
});
async function videoOnBtnFun(){
    if (!localTracks.videoTrack) {
        alert("Camera track not found!");
        return;
    }
    try {
        await localTracks.videoTrack.setEnabled(true);
        console.log("Camera is ON now.");
    } catch (err) {
        console.error("Failed to turn on camera:", err);
    }
};

// ========== Mic OFF ==========
document.getElementById("micOffBtn").addEventListener("click", async function(){
    micOffBtnFnc();
    document.getElementById("micOffBtn").classList.add("d-none");
    document.getElementById("micOnBtn").classList.remove("d-none");
});
async function micOffBtnFnc(){
    if (!localTracks.audioTrack) {
        alert("Mic track not found!");
        return;
    }
    try {
        await localTracks.audioTrack.setEnabled(false);
        console.log("Mic is OFF now.");
    } catch (err) {
        console.error("Failed to turn off mic:", err);
    }
};

// ========== Mic ON ==========
document.getElementById("micOnBtn").addEventListener("click", async function(){
    micOnBtnFnc();
    document.getElementById("micOffBtn").classList.remove("d-none");
    document.getElementById("micOnBtn").classList.add("d-none");
});
async function micOnBtnFnc(){
    if (!localTracks.audioTrack) {
        alert("Mic track not found!");
        return;
    }
    try {
        await localTracks.audioTrack.setEnabled(true);
        console.log("Mic is ON now.");
    } catch (err) {
        console.error("Failed to turn on mic:", err);
    }
};
