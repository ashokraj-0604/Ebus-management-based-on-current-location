
// Bus Form Submission
const busForm = document.getElementById('bus-form');
const successMessage = document.getElementById('success-message');

busForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const busName = document.getElementById('busName').value;
    const busType = document.getElementById('busType').value;
    const busDetails = document.getElementById('busDetails').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const stops = document.getElementById('stops').value;
    const fare = document.getElementById('fare').value;

    // Validate fields
    if (!busName || !busType || !contactNumber || !source || !destination || !fare) {
        alert("Please fill all required fields!");
        return;
    }

    // Get logged-in user's UID
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to submit bus information.");
        return;
    }

    // Save bus information to Firestore
    db.collection('buses').add({
        ownerId: user.uid,
        ownerEmail: user.email,
        busName: busName,
        busType: busType,
        busDetails: busDetails,
        contactNumber: contactNumber,
        source: source,
        destination: destination,
        stops: stops.split('\n'), // Save stops as an array of strings
        fare: parseFloat(fare), // Convert fare to number
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
        successMessage.style.display = 'block';
        busForm.reset();
    })
    .catch((error) => {
        console.error("Error adding bus information:", error.message);
        alert("Failed to post bus information. Please try again.");
    });
});
const logoutButton = document.getElementById('logout-button'); // Moved this here
  
  // Logout Button Functionality
  logoutButton.addEventListener('click', () => {
    // Log out the user using Firebase Auth
    firebase.auth().signOut()
      .then(() => {
        // Redirect user to login page after logout
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  });