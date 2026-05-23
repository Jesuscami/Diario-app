 
/* =========================
   🔥 FIREBASE CONFIG
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyAZpt-SagZqzBgPL8mhRLJWRpA9yxFFBik",
  authDomain: "mi-diario-13fb0.firebaseapp.com",
  projectId: "mi-diario-13fb0",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/* =========================
   📦 DATOS
========================= */
let entradas = JSON.parse(localStorage.getItem("diario")) || [];

/* =========================
   🔐 LOGIN EMAIL
========================= */
function login() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(showApp)
    .catch(e => alert(e.message));
}

function register() {
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .then(showApp)
    .catch(e => alert(e.message));
}

/* 🔵 GOOGLE LOGIN */
function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(showApp)
    .catch(e => alert(e.message));
}

/* 🚪 LOGOUT */
function logout() {
  auth.signOut().then(() => location.reload());
}

/* 👤 AUTO LOGIN */
auth.onAuthStateChanged(user => {
  if (user) showApp();
});

/* =========================
   📱 SHOW APP
========================= */
function showApp() {
  loginBox.classList.add("hidden");
  app.classList.remove("hidden");

  render();
  actualizarSemana();
}

/* =========================
   🤖 IA EMOCIONAL AVANZADA
========================= */
function analizarEmocion(texto) {
  texto = texto.toLowerCase();

  let score = 0;

  const positivo = ["feliz", "genial", "bien", "amor", "contento", "felicidad"];
  const negativo = ["triste", "mal", "solo", "odio", "ansiedad", "cansado"];

  positivo.forEach(p => { if (texto.includes(p)) score += 1; });
  negativo.forEach(n => { if (texto.includes(n)) score -= 1; });

  if (score >= 2) return "muy feliz 😄";
  if (score === 1) return "feliz 🙂";
  if (score === 0) return "neutral 😐";
  if (score === -1) return "triste 🙁";
  return "muy triste 😢";
}

/* LIVE IA */
document.getElementById("texto").addEventListener("input", e => {
  iaResult.innerText = "IA: " + analizarEmocion(e.target.value);
});

/* =========================
   💾 GUARDAR
========================= */
function guardar() {
  const texto = document.getElementById("texto").value;
  if (!texto) return;

  const entrada = {
    id: Date.now(),
    texto,
    emocion: analizarEmocion(texto),
    fecha: new Date().toISOString()
  };

  entradas.unshift(entrada);
  localStorage.setItem("diario", JSON.stringify(entradas));

  render();
  actualizarSemana();
}

/* =========================
   🧾 RENDER
========================= */
function render() {
  lista.innerHTML = "";

  entradas.forEach(e => {
    lista.innerHTML += `
      <div class="card">
        <p>${e.texto}</p>
        <small>${e.emocion} • ${new Date(e.fecha).toLocaleString()}</small>

        <button onclick="crearImagen(${e.id})">
          📱 Compartir WhatsApp / Instagram
        </button>
      </div>
    `;
  });
}

/* =========================
   📸 IMAGEN
========================= */
function crearImagen(id) {
  const e = entradas.find(x => x.id === id);
  if (!e) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1080;
  canvas.height = 1920;

  const grad = ctx.createLinearGradient(0,0,1080,1920);
  grad.addColorStop(0, "#141e30");
  grad.addColorStop(1, "#243b55");

  ctx.fillStyle = grad;
  ctx.fillRect(0,0,1080,1920);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "bold 70px Arial";
  ctx.fillText("💭 Reflexión", 540, 200);

  ctx.font = "50px Arial";

  let y = 600;
  let line = "";

  for (let w of e.texto.split(" ")) {
    const test = line + w + " ";
    if (test.length > 22) {
      ctx.fillText(line, 540, y);
      line = w + " ";
      y += 80;
    } else {
      line = test;
    }
  }

  ctx.fillText(line, 540, y);

  ctx.font = "60px Arial";
  ctx.fillText(e.emocion, 540, y + 160);

  const a = document.createElement("a");
  a.download = "reflexion.png";
  a.href = canvas.toDataURL();
  a.click();
}

/* =========================
   📊 SEMANA
========================= */
function obtenerSemana() {
  const hace7 = new Date();
  hace7.setDate(hace7.getDate() - 7);

  return entradas.filter(e => new Date(e.fecha) >= hace7);
}

function calcularSemana() {
  let stats = { feliz:0, neutro:0, triste:0 };

  obtenerSemana().forEach(e => {
    if (e.emocion.includes("feliz")) stats.feliz++;
    else if (e.emocion.includes("triste")) stats.triste++;
    else stats.neutro++;
  });

  return stats;
}

let chart;

function actualizarSemana() {
  const s = calcularSemana();

  analisisSemana.innerText =
    s.feliz > s.triste ? "🟢 Semana positiva"
    : s.triste > s.feliz ? "🔴 Semana difícil"
    : "🟡 Semana equilibrada";

  const ctx = document.getElementById("graficaSemana");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Feliz", "Neutro", "Triste"],
      datasets: [{
        data: [s.feliz, s.neutro, s.triste]
      }]
    }
  });
  if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("PWA activada"))
    .catch(err => console.log("Error SW", err));
}
}