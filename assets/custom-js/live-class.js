import { CLASS_UPDATE_API, domain, LIVE_CLASS_APP_ID } from "./global/apis.js";

/********************************************
 *  Replace with your own details
 ********************************************/
const APP_ID = `${LIVE_CLASS_APP_ID}`;
const SERVER_URL = `${domain}`;
/********************************************/

// ========= [ A. RTC Setup with 2 Clients ] =========
// -- Client A: for camera + mic --
let mainClient;
let localTracks = {
    videoTrack: null,
    audioTrack: null
};
let isMainPublished = false;

// -- Client B: for screen share --
let screenClient;
let screenTrack = null;
let isScreenPublished = false;

// ========= [ B. RTM (Chat) Setup ] =========
let rtmClient;
let rtmChannel;
// ======================================================================================
// ======================================================================================
// ======================================================================================
let __id = localStorage.getItem("liveClassIdStart");
// ======================================================================================
(function(){
    if(localStorage.getItem("liveClassIdStart")){
        liveClassStart();
    } else {
        // localStorage.clear();
        // window.location.href = 'sign-in.html';  
    }
})();
// ======================================================================================
// ======================================================================================

// =========== Start Button (Camera & Mic) ===========
// document.getElementById("startBtn").addEventListener("click", liveClassStart)

async function liveClassStart(){
    if (isMainPublished) {
        alert("Already streaming camera!");
        return;
    }

    // Get the channel name
    const channelName = __id;
    if (!channelName) {
        alert("Please enter a channel name first!");
        return;
    }

    // Random teacher UID
    const uid = String(Math.floor(Math.random() * 10000));
    const role = "publisher";

    // 1) Get RTC token
    let rtcToken;
    try {
        const resp = await fetch(`${SERVER_URL}/rtc-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelName, uid, role })
        });
        const data = await resp.json();
        rtcToken = data.token;
    } catch (err) {
        console.error("Failed to get RTC token:", err);
        return;
    }

    try {
        // 2) mainClient join
        mainClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        await mainClient.join(APP_ID, channelName, rtcToken, uid);

        // 3) Create camera+mic
        const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracks.audioTrack = micTrack;
        localTracks.videoTrack = camTrack;

        // 4) Play camera in teacher-stream
        localTracks.videoTrack.play("teacher-stream");

        // 5) Publish
        await mainClient.publish([micTrack, camTrack]);
        isMainPublished = true;
        console.log("Camera stream published!");

        // 6) Also log in to RTM and join channel for chat
        // await startRTM(channelName, uid);
    } catch (err) {
        console.error("Error starting main stream:", err);
    }
};

// ========== Stop Button (Stop All Streaming) ==========
let stopBtnEventListener = document.getElementById("stopBtn");
stopBtnEventListener.addEventListener("click", async function(){
    console.log("hello brohter, this si fiish. ")
    localStorage.removeItem("liveClassIdStart");
    liveClassStop();
    
    console.log("hello brohter, sfgsfa=fa=df=a===================adf=asdf=")
    console.log("hello brohter, sfgsfa=fa=df=a===================adf=asdf=")
    
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
    console.log("hello brohter, sfgsfa=fa=df=a===================adf=asdf=")
    
})

async function liveClassStop(){

    // 1) Stop camera+mic
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

    // 2) Stop screen share
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

    // 3) Clear UI
    document.getElementById("teacher-stream").innerHTML = "";
    document.getElementById("screen-stream").innerHTML = "";
    document.body.classList.remove("screensharing");

    // 4) Leave RTM channel if joined
    if (rtmChannel) {
        await rtmChannel.leave();
        rtmChannel = null;
    }
    if (rtmClient) {
        await rtmClient.logout();
        rtmClient = null;
    }

    console.log("All streaming & RTM stopped.");
};

// ========== Screen Share ON ==========
document.getElementById("screenShareBtn").addEventListener("click", function() {
    screenShareOnBtnFun();
    document.getElementById("screenShareBtn").classList.add("d-none");
    document.getElementById("screenShareOffBtn").classList.remove("d-none");
})

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

    // New random UID for screen client
    const uid = String(Math.floor(Math.random() * 10000));
    const role = "publisher";

    // 1) Get RTC token for second client
    let screenToken;
    try {
        const resp = await fetch(`${SERVER_URL}/rtc-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelName, uid, role })
        });
        const data = await resp.json();
        screenToken = data.token;
    } catch (err) {
        console.error("Failed to get screen RTC token:", err);
        return;
    }

    // 2) Create screenClient, join channel
    try {
        screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        await screenClient.join(APP_ID, channelName, screenToken, uid);

        // 3) Create screen track
        screenTrack = await AgoraRTC.createScreenVideoTrack(
            { encoderConfig: "1080p_1" },
            "auto"
        );

        // 4) Publish screen track
        await screenClient.publish(screenTrack);
        isScreenPublished = true;
        console.log("Screen sharing published!");

        // 5) Play in #screen-stream
        document.body.classList.add("screensharing");
        screenTrack.play("screen-stream");
    } catch (err) {
        console.error("Error starting screen share:", err);
    }
};

// ========== Screen Share OFF ==========
document.getElementById("screenShareOffBtn").addEventListener("click", function(){
    screenShareOffFunction();
    document.getElementById("screenShareBtn").classList.remove("d-none");
    document.getElementById("screenShareOffBtn").classList.add("d-none");
})

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
        console.log("Screen sharing stopped!");
    } catch (err) {
        console.error("Error stopping screen share:", err);
    }
};

// ========== Video OFF (Camera) ==========
document.getElementById("videoOffBtn").addEventListener("click", function(){
    videoOffBtnFunction();
    
    document.getElementById("videoOffBtn").classList.add("d-none");
    document.getElementById("videoOnBtn").classList.remove("d-none");
})
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
document.getElementById("videoOnBtn").addEventListener("click", function(){
    videoOnBtnFun();
    document.getElementById("videoOnBtn").classList.add("d-none");
    document.getElementById("videoOffBtn").classList.remove("d-none");
})
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
document.getElementById("micOffBtn").addEventListener("click", function(){
    micOffBtnFnc();
    
    document.getElementById("micOffBtn").classList.add("d-none");
    document.getElementById("micOnBtn").classList.remove("d-none");
})
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
document.getElementById("micOnBtn").addEventListener("click", function(){
    micOnBtnFnc();
    
    document.getElementById("micOffBtn").classList.remove("d-none");
    document.getElementById("micOnBtn").classList.add("d-none");
})
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

// ========== RTM (Chat) Logic ==========
// async function startRTM(channelName, uid) {
//     try {
//         // 1) Get RTM token
//         const resp = await fetch(`${SERVER_URL}/rtm-token`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ uid })
//         });
//         console.warn("Fetching RTM token...");
//         const data = await resp.json();
//         const rtmToken = data.token;
//         console.warn("RTM token fetched:", rtmToken);

//         // 2) Create RTM client & login
//         console.warn("Logging in to RTM...");
//         rtmClient = AgoraRTM.createInstance(APP_ID);
//         await rtmClient.login({ token: rtmToken, uid });
//         console.warn("RTM login success, uid:", uid);
//         console.warn("Successfully logged in to RTM.");

//         // 3) Join RTM channel
//         console.warn("Joining RTM channel...");
//         rtmChannel = await rtmClient.createChannel(channelName);
//         await rtmChannel.join();
//         console.warn("RTM channel joined:", channelName);
//         console.warn("Joined RTM channel:", channelName);

//         // 4) Listen for incoming messages
//         rtmChannel.on("ChannelMessage", ({ text }, senderId) => {
//             addMessageToChatBox(`User(${senderId}): ${text}`);
//         });
//     } catch (err) {
//         console.error("Error starting RTM:", err);
//     }
// }

// ---------- Send Chat Message ----------
// document.getElementById("send-btn").onclick = async () => {
//     if (!rtmChannel) {
//         alert("Not in RTM channel yet!");
//         return;
//     }
//     const input = document.getElementById("chat-input");
//     const msg = input.value.trim();
//     if (!msg) return;

//     try {
//         await rtmChannel.sendMessage({ text: msg });
//         addMessageToChatBox(`Me: ${msg}`);
//         input.value = "";
//     } catch (err) {
//         console.error("Failed to send RTM message:", err);
//     }
// };

// Display a new chat message in the #chat-box
// function addMessageToChatBox(message) {
//     const box = document.getElementById("chat-box");
//     const newMsg = document.createElement("div");
//     newMsg.innerText = message;
//     box.appendChild(newMsg);
//     box.scrollTop = box.scrollHeight;
// }
