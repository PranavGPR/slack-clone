function joinNs(endpoint) {
  if (nsSocket) {
    nsSocket.close();
    document
      .querySelector("#user-input")
      .removeEventListener("submit", formSubmission);
  }
  nsSocket = io(`http://localhost:5000${endpoint}`);
  nsSocket.on("wikiRoomLoad", (rooms) => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    rooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class="room">
      <span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}
    </li>`;
    });
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((element) => {
      element.addEventListener("click", (e) => {
        joinRoom(e.target.innerText);
      });
    });

    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on("messageToClients", (msg) => {
    const newMsg = buildHTML(msg);
    document.querySelector("#messages").innerHTML += newMsg;
  });

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission);
}

function formSubmission(event) {
  event.preventDefault();
  const messageField = document.querySelector("#user-message");
  nsSocket.emit("newMessageToServer", { text: messageField.value });
  messageField.value = "";
}

function buildHTML(data) {
  const convertedDate = new Date(data.time).toLocaleString();
  const newHTML = `
    <li>
          <div class="user-image">
            <img src=${data.avatar} />
          </div>
          <div class="user-message">
            <div class="user-name-time">${data.username} <span>${convertedDate}</span></div>
            <div class="message-text">${data.text}</div>
          </div>
    </li>
    `;
  return newHTML;
}
