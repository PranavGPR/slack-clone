const socket = io("http://localhost:5000");
let nsSocket = "";

socket.on("nsList", (nsData) => {
  console.log("The list of namespaces has arrived!");
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /> </div>`;
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        const nsEndpoint = element.getAttribute("ns");
        console.log(`${nsEndpoint} is where I should go now`);
      });
    }
  );
  joinNs("/wiki");
});
