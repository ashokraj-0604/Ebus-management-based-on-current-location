// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginToggle = document.getElementById('login-toggle');
const registerToggle = document.getElementById('register-toggle');
const loginErrorMessage = document.getElementById('login-error-message');
const registerErrorMessage = document.getElementById('register-error-message');

// Toggle Forms
loginToggle.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    console.log('Switched to login form');
});

registerToggle.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerToggle.classList.add('active');
    loginToggle.classList.remove('active');
    console.log('Switched to register form');
});

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    console.log(`Attempting to log in with email: ${email}`);

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login successful:', userCredential.user);
            window.location.href = "user.html"; // Redirect to bus search page
        })
        .catch((error) => {
            console.error('Login error:', error.message);
            loginErrorMessage.textContent = error.message;
        });
});

// Register Form Submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('register-firstName').value;
    const lastName = document.getElementById('register-lastName').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    console.log(`Attempting to register with email: ${email}`);

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save additional user data in Firestore
            return db.collection('users').doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email
            });
        })
        .then(() => {
            console.log('Registration successful');
            alert('Registration successful! You can now log in.');
            registerForm.reset();
            registerToggle.click(); // Switch to Login form
        })
        .catch((error) => {
            console.error('Registration error:', error.message);
            registerErrorMessage.textContent = error.message;
        });
});