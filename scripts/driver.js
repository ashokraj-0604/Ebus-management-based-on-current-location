const busForm = document.getElementById('bus-form');
const successMessage = document.getElementById('success-message');

busForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form reload

    // Get values
    const busName = document.getElementById('busName').value.trim();
    const busType = document.getElementById('busType').value.trim();
    const busDetails = document.getElementById('busDetails').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const source = document.getElementById('source').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const stops = document.getElementById('stops').value.trim();
    const fare = document.getElementById('fare').value.trim();

    console.log("Submitting bus information:", { busName, busType, source, destination, fare }); // Log form values

    // Validate required fields
    if (!busName || !busType || !contactNumber || !source || !destination || !fare) {
        alert("Please fill all required fields!");
        console.warn("Form submission failed: Missing required fields");
        return;
    }

    // Get the logged-in user's UID
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to submit bus information.");
        console.error("Form submission failed: No logged-in user detected");
        return;
    }

    console.log("Logged-in user UID:", user.uid); 

    // Save bus information to Firestore
    db.collection('buses')
        .add({
            ownerId: user.uid,
            ownerEmail: user.email,
            busName: busName,
            busType: busType,
            busDetails: busDetails || "N/A", // Default if optional field is empty
            contactNumber: contactNumber,
            source: source,
            destination: destination,
            stops: stops ? stops.split('\n') : [], // Convert stops to array
            fare: parseFloat(fare), 
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            console.log("Bus information saved successfully");
            successMessage.style.display = 'block'; // Show success message
            busForm.reset(); // Reset after successful submission
        })
        .catch((error) => {
            console.error("Error adding bus information:", error.message); 
            alert("Failed to post bus information. Please try again.");
        });
});

// Logout Button Functionality
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
    console.log("Logging out user..."); 

    firebase.auth().signOut()
        .then(() => {
            console.log("User logged out successfully");
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("Error logging out:", error.message); // Log logout error
            alert("Failed to log out. Please try again.");
        });
});