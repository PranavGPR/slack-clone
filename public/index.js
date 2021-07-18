const socket = io("http://localhost:5000");

socket.on("connect", (data) => {
  let h1 = document.getElementById("id");
  h1.innerHTML = `Welcome ${socket.id}!`;
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { message: newMessage });
});

socket.on("messageFromServer", (data) => {
  console.log(data);
  socket.emit("messageToServer", { message: "Data from the Client!" });
});

socket.on("messageToClients", (data) => {
  document.querySelector("#messages").innerHTML += `<li>${data.message}</li>`;
});
