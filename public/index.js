const socket = io("http://localhost:5000");
const adminSocket = io("http://localhost:5000/admin");

socket.on("messageFromServer", (data) => {
  console.log(data);
  socket.emit("messageToServer", { message: "Data from the Client!" });
});

socket.on("joined", (data) => {
  console.log(data);
});

adminSocket.on("welcome", (data) => {
  console.log(data);
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { message: newMessage });
});
