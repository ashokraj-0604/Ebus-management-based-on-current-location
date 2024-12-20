// Reference to form elements
const form = document.getElementById('create-user-form');
const statusMessage = document.getElementById('status-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    try {
        // Create user account using Firebase Admin SDK (Admin privilege needed)
        const createUser = firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid;
            // Store user role in Firestore
            return db.collection('users').doc(userId).set({
                email: email,
                role: role
            });
        })
        .then(() => {
            statusMessage.textContent = `Account created successfully with role: ${role}`;
            form.reset();
        })
        .catch((error) => {
            statusMessage.textContent = `Error: ${error.message}`;
        });
    } catch (error) {
            statusMessage.textContent = `Error: ${error.message}`;
        }
});