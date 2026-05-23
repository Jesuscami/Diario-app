// 🔥 CONFIGURA AQUÍ TU FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAZpt-SagZqzBgPL8mhRLJWRpA9yxFFBik",
  authDomain: "mi-diario-13fb0.firebaseapp.com",
  projectId: "mi-diario-13fb0",
  storageBucket: "mi-diario-13fb0.firebasestorage.app",
  messagingSenderId: "649575206242",
  appId: "1:649575206242:web:c57a913de39e592af8b03b",
  measurementId: "G-6B4Z17XS1L"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/* 👁️ mostrar contraseña */
function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

/* 🔐 LOGIN */
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showApp();
    })
    .catch(err => {
      document.getElementById("error").innerText = err.message;
    });
}

/* 🆕 REGISTRO */
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showApp();
    })
    .catch(err => {
      document.getElementById("error").innerText = err.message;
    });
}

/* 🚪 LOGOUT */
function logout() {
  auth.signOut().then(() => location.reload());
}

/* 👤 CONTROL DE SESIÓN */
auth.onAuthStateChanged(user => {
  if (user) {
    showApp();
  }
});

function showApp() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

/* 📓 DIARIO SIMPLE (local por ahora) */
function guardar() {
  const texto = document.getElementById("texto").value;

  if (!texto) return;

  const div = document.createElement("div");
  div.innerHTML = `<p>${texto}</p>`;
  document.getElementById("lista").appendChild(div);
}