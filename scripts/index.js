const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Event listener for form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Get user input
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    console.log("Attempting to authenticate user with email:", email); // Logging user action

    // Authenticate user with Firebase Authentication
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            const userId = user.uid; 

            console.log(`User authenticated successfully. UID: ${userId}`); // Logging success

            // Fetch user role in Firestore
            db.collection('users').doc(userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const role = doc.data().role;
                        console.log(`Role retrieved for UID ${userId}: ${role}`); // Logging role

                        // Role-based re-direct
                        if (role === 'driver') {
                            window.location.href = 'driver.html';
                            console.log("Redirected to Driver page.");
                        } else if (role === 'travel') {
                            window.location.href = 'travel.html';
                            console.log("Redirected to Travel page.");
                        } else if (role === 'admin') {
                            window.location.href = 'admin.html';
                            console.log("Redirected to Admin page.");
                        } else {
                            console.warn(`Invalid role for UID ${userId}: ${role}`);
                            errorMessage.textContent = "Role not assigned or invalid!";
                        }
                    } else {
                        console.error(`No document found for UID ${userId}`); 
                        errorMessage.textContent = "User data not found in Firestore.";
                    }
                })
                .catch((error) => {
                    console.error(`Firestore error for UID ${userId}: ${error.message}`);
                    errorMessage.textContent = `Firestore Error: ${error.message}`;
                });
        })
        .catch(error => {
            console.error(`Authentication error for email ${email}: ${error.message}`); 
            errorMessage.textContent = `Authentication Error: ${error.message}`;
        });
});