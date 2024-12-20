// DOM Elements
  const busSearchForm = document.getElementById('bus-search-form');
  const busListContainer = document.getElementById('bus-list');
  const logoutButton = document.getElementById('logout-btn'); // Moved this here
  
  // Logout Button Functionality
  logoutButton.addEventListener('click', () => {
    // Log out the user using Firebase Auth
    firebase.auth().signOut()
      .then(() => {
        // Redirect user to login page after logout
        window.location.href = 'userlogin.html';
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  });
  
  // Search Form Submission
  busSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // Get source and destination values
    const source = document.getElementById('source').value.trim();
    const destination = document.getElementById('destination').value.trim();
  
    if (source === '' || destination === '') {
      busListContainer.innerHTML = '<p>Please enter both source and destination.</p>';
      return;
    }
  
    // Search buses by source and destination
    searchBuses(source, destination);
  });
  
  // Search Buses Function
  function searchBuses(source, destination) {
    // Clear previous results
    busListContainer.innerHTML = '<p>Loading...</p>';
  
    // Query Firestore for buses with matching source and destination
    db.collection('buses')
      .where('source', '==', source)
      .where('destination', '==', destination)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          busListContainer.innerHTML = '<p>No buses found for this route.</p>';
          return;
        }
  
        // Clear loading text
        busListContainer.innerHTML = '';
  
        // Display buses in the list
        querySnapshot.forEach((doc) => {
          const busData = doc.data();
          const busElement = document.createElement('div');
          busElement.classList.add('bus-item');
  
          const stops = Array.isArray(busData.stops) ? busData.stops.join(', ') : 'Not available';
          const timings = Array.isArray(busData.timings) ? busData.timings.join(', ') : 'Not available';
  
          busElement.innerHTML = `
            <h3>${busData.busName}</h3>
            <p><strong>Bus Type:</strong> ${busData.busType}</p>
            <p><strong>Details:</strong> ${busData.busDetails}</p>
            <p><strong>Contact:</strong> ${busData.contactNumber}</p>
            <p><strong>Stops:</strong> ${stops}</p>
            <p><strong>Timings:</strong> ${timings}</p>
            <p><strong>Fare:</strong> $${busData.fare}</p>
          `;
  
          busListContainer.appendChild(busElement);
        });
      })
      .catch((error) => {
        console.error('Error fetching buses:', error);
        busListContainer.innerHTML = '<p>Error fetching buses. Please try again later.</p>';
      });
  }
  