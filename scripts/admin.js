const form = document.getElementById('create-user-form');
const statusMessage = document.getElementById('status-message');

// Event listener for form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form refresh

    // Get user inputs
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value.trim();

    console.log("Attempting to create a new user account."); // Log action
    try {
        // Create a new user in Firebase Authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const userId = userCredential.user.uid; // Get the new user's UID

        console.log(`User created successfully. UID: ${userId}, Email: ${email}`); // Log success

        // Store user data and role in Firestore
        await db.collection('users').doc(userId).set({
            email: email,
            role: role
        });

        console.log(`Role '${role}' assigned to UID: ${userId}`); // Log role assignment

        // Update UI
        statusMessage.textContent = `Account created successfully with role: ${role}`;
        form.reset();
    } catch (error) {
        console.error("Error during user creation:", error.message); // Log error
        statusMessage.textContent = `Error: ${error.message}`;
    }
});