// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAbYTSTs-wth8_qVGvjgThIG-__Ek69NtE",
    authDomain: "ebus-management-9a2ba.firebaseapp.com",
    projectId: "ebus-management-9a2ba",
    storageBucket: "ebus-management-9a2ba.firebasestorage.app",
    messagingSenderId: "1080724320675",
    appId: "1:1080724320675:web:50f4dd697e19a15174aa16",
    measurementId: "G-BWXE2GPSL9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const database = firebase.database();
  
  // Handle Registration
  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
  
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
  
        // Save user details in the database
        database.ref("users/" + userId).set({
          firstName,
          lastName,
          email,
          role: "user"
        });
        alert("Registration successful! You can now log in.");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  });
  
  // Handle Login
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("Login successful!");
        window.location.href = "user.html"; // Redirect to user dashboard
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  });
  
  //user 
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
  
  //driver

  document.addEventListener("DOMContentLoaded", () => {
    const auth = firebase.auth();
    const database = firebase.database();
  
    // Ensure only logged-in drivers can access
    auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("Please log in first!");
        window.location.href = "index.html";
      } else {
        database.ref("users/" + user.uid).once("value").then((snapshot) => {
          if (snapshot.val().role !== "driver") {
            alert("Unauthorized access!");
            auth.signOut();
            window.location.href = "index.html";
          }
        });
      }
    });
  
    // Post Bus Information
    document.getElementById("postBusForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const busType = document.getElementById("busType").value;
      const source = document.getElementById("source").value;
      const destination = document.getElementById("destination").value;
      const contact = document.getElementById("contact").value;
  
      const busRef = database.ref("buses").push();
      busRef.set({
        driverId: auth.currentUser.uid,
        busType,
        source,
        destination,
        contact
      });
      alert("Bus information posted!");
      document.getElementById("postBusForm").reset();
    });
  
    // Fetch and Display Driver's Buses
    const busList = document.getElementById("busList");
    database.ref("buses").orderByChild("driverId").equalTo(auth.currentUser.uid).on("value", (snapshot) => {
      busList.innerHTML = "";
      snapshot.forEach((childSnapshot) => {
        const bus = childSnapshot.val();
        const li = document.createElement("li");
        li.textContent = `${bus.busType} - ${bus.source} to ${bus.destination} (Contact: ${bus.contact})`;
        busList.appendChild(li);
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
  
//admin
document.addEventListener("DOMContentLoaded", () => {
    const auth = firebase.auth();
    const database = firebase.database();
  
    // Ensure only logged-in admins can access
    auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("Please log in first!");
        window.location.href = "index.html";
      } else {
        database.ref("users/" + user.uid).once("value").then((snapshot) => {
          if (snapshot.val().role !== "admin") {
            alert("Unauthorized access!");
            auth.signOut();
            window.location.href = "index.html";
          }
        });
      }
    });
  
    // Create Driver Login
    document.getElementById("createDriverForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const driverName = document.getElementById("driverName").value;
      const driverEmail = document.getElementById("driverEmail").value;
      const driverPassword = document.getElementById("driverPassword").value;
  
      auth.createUserWithEmailAndPassword(driverEmail, driverPassword)
        .then((userCredential) => {
          const userId = userCredential.user.uid;
          database.ref("users/" + userId).set({
            name: driverName,
            email: driverEmail,
            role: "driver"
          });
          alert("Driver login created successfully!");
          document.getElementById("createDriverForm").reset();
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });
  
    // Logout
    document.getElementById("logoutButton").addEventListener("click", () => {
      auth.signOut().then(() => {
        alert("Logged out!");
        window.location.href = "index.html";
      });
    });
  
    // Fetch and Display Driver/Travel List
    database.ref("users").orderByChild("role").equalTo("driver").on("value", (snapshot) => {
      const driverList = document.getElementById("driverList");
      driverList.innerHTML = ""; // Clear list
      snapshot.forEach((childSnapshot) => {
        const driver = childSnapshot.val();
        const li = document.createElement("li");
        li.textContent = `${driver.name} (${driver.email})`;
        driverList.appendChild(li);
      });
    });
  });
  