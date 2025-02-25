// Redirect to sign-in if no token exists
if (!localStorage.getItem("token")) {
  localStorage.clear();
  window.location.href = "sign-in.html";
}

import { domain, LIVE_CLASS_APP_ID, CLASS_GET_API } from "./global/apis.js";
import {
  loading_shimmer,
  remove_loading_shimmer,
} from "./global/loading_shimmer.js";

const token = localStorage.getItem("token");

let id = new URLSearchParams(window.location.search).get("id");

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
const remoteScreenContainer = document.getElementById(
  "remote-screen-container"
);

// Flags to track teacher stream availability
// (Teacher uses fixed UIDs: 1001 for camera, 1002 for screen)
let teacherCameraActive = false;
let teacherScreenActive = false;

// Fetch token from the server
async function getToken(channel, uid) {
  try {
    const response = await fetch(
      `${SERVER_URL}/rtcToken?channel=${channel}&uid=${uid || 0}`
    );
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

//Showing Get API By Id---------------------------------------------------------
window.editLoadData = async function editLoadData() {
  try {
    loading_shimmer();
  } catch (error) {
    console.error(error);
  }
  const instructorName = document.getElementById("instructor-name");
  const classTitle = document.getElementById("class-title");
  const courseTitle = document.getElementById("course-title");
  const batchId = document.getElementById("batch-id");
  const courseDescription = document.getElementById("course-description");
  const courseCategory = document.getElementById("course-category");
  try {
    const API = `${CLASS_GET_API}?_id=${id}`;
    console.log("This is my get API: ", API);

    const response = await fetch(API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }

    const res = await response.json();
    console.log("This is my response: ", res);
    const classRes = res.class;
    const firstName = classRes.instructor?.first_name
      ? classRes.instructor?.first_name
      : "";
    const lastName = classRes.instructor?.last_name
      ? classRes.instructor?.last_name
      : "";
    const instructor = firstName + " " + lastName;
    console.log("This is my response: ", classRes);
    instructorName.innerText = instructor;
    classTitle.innerText = classRes.classTitle || "";
    courseTitle.innerText = classRes.course.title || "";
    batchId.innerText = classRes.batch.batchId || "";
    courseDescription.innerText = classRes.description || "";
    courseCategory.innerText = classRes.courseCategory.categoryName || "";
    // phoneNumber.value = classRes.phoneNumber
    // address.value = classRes.address
    // email.value = classRes.email
    // image.src = classRes.image? classRes.image : 'assets/images/thumbs/upload-image.png'
    // role.value = classRes.roles._id
    // imageFileUpload.files[0].name = employee.image
  } catch (error) {}
  try {
    remove_loading_shimmer();
  } catch (error) {
    console.error(error);
  }
};
editLoadData(); //get By Id API
//----------------------------------------

let name = localStorage.getItem("name");
let role = localStorage.getItem("roles");
// socket code start ---------------------
var socket = io(domain);
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const showMessages = document.getElementById("showMessages");
//  Listen for a successful connection
// socket.on('connect', () => {
//     console.log('Connected to server:', socket.id);
// });

// Utility function to get current time in 12-hour format with AM/PM.
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // convert '0' to '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + ampm;
}

socket.on("message", (name, role, message) => {
  const messageContainer = document.createElement("div");

  // If this isn't the first message, add a margin-top class.
  if (document.getElementById("showMessages").children.length > 0) {
    messageContainer.classList.add("mt-20");
  }

  // Create header for sender's name and role.
  const header = document.createElement("h6");
  header.className = "mb-0";
  header.innerHTML = `${name} <small class="text-muted">(${role})</small>`;

  // Create the message bubble.
  const bubble = document.createElement("div");
  bubble.className = "message-bubble mt-1";

  // Create the paragraph for the message content.
  const p = document.createElement("p");
  p.className = "mb-0";
  p.textContent = message;

  // Create a small element to display the current time.
  const timeEl = document.createElement("small");
  timeEl.className = "text-muted d-block text-end";
  timeEl.textContent = getCurrentTime();

  // Assemble the message bubble.
  bubble.appendChild(p);
  bubble.appendChild(timeEl);
  messageContainer.appendChild(header);
  messageContainer.appendChild(bubble);

  // Append the constructed message to the messages area.
  document.getElementById("showMessages").appendChild(messageContainer);
});

// Send a message when the send button is clicked.
document.getElementById("sendBtn").addEventListener("click", () => {
  const messageInput = document.getElementById("message");
  const message = messageInput.value.trim();
  if (message !== "") {
    socket.emit("user-message", name, role, message);
    messageInput.value = "";
  }
});

// socket code end -----------------------
