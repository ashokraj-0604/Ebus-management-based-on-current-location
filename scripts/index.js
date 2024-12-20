// Login Form Logic
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Authenticate user
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            const userId = user.uid; // Get the user ID (UID)

            // Fetch role from Firestore
            db.collection('users').doc(userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const role = doc.data().role;

                        // Redirect based on role
                        if (role === 'driver') {
                            window.location.href = 'driver.html';
                        } else if (role === 'travel') {
                            window.location.href = 'driver.html';
                        } else if (role === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            errorMessage.textContent = "Role not assigned or invalid!";
                        }
                    } else {
                        errorMessage.textContent = "User data not found in Firestore.";
                    }
                })
                .catch((error) => {
                    errorMessage.textContent = `Firestore Error: ${error.message}`;
                });
        })
        .catch(error => {
            errorMessage.textContent = `Authentication Error: ${error.message}`;
        });
});
