document.addEventListener("DOMContentLoaded", () => {
    const auth = firebase.auth();
    const database = firebase.database();
  
    // Ensure only logged-in users can access
    auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("Please log in first!");
        window.location.href = "index.html";
      } else {
        database.ref("users/" + user.uid).once("value").then((snapshot) => {
          if (snapshot.val().role !== "user") {
            alert("Unauthorized access!");
            auth.signOut();
            window.location.href = "index.html";
          }
        });
      }
    });
  
    // Search for Buses
    document.getElementById("searchBusForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const source = document.getElementById("searchSource").value.toLowerCase();
      const destination = document.getElementById("searchDestination").value.toLowerCase();
  
      database.ref("buses").once("value", (snapshot) => {
        const busResults = document.getElementById("busResults");
        busResults.innerHTML = ""; // Clear previous results
  
        snapshot.forEach((childSnapshot) => {
          const bus = childSnapshot.val();
          if (
            bus.source.toLowerCase() === source &&
            bus.destination.toLowerCase() === destination
          ) {
            const li = document.createElement("li");
            li.textContent = `${bus.busType} - ${bus.source} to ${bus.destination} (Contact: ${bus.contact})`;
            busResults.appendChild(li);
          }
        });
  
        if (busResults.innerHTML === "") {
          const li = document.createElement("li");
          li.textContent = "No buses found for the specified route.";
          busResults.appendChild(li);
        }
      });
    });
  
    // Logout
    document.getElementById("logoutButton").addEventListener("click", () => {
      auth.signOut().then(() => {
        alert("Logged out!");
        window.location.href = "index.html";
      });
    });
  });
  