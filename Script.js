/* 🔥 FIREBASE CONFIG (RELLENAR) */
const firebaseConfig = {
  apiKey: "AIzaSyAZpt-SagZqzBgPL8mhRLJWRpA9yxFFBik",
  authDomain: "mi-diario-13fb0.firebaseapp.com",
  projectId: "mi-diario-13fb0",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let entradas = JSON.parse(localStorage.getItem("diario")) || [];

/* 👁️ PASSWORD */
function togglePassword() {
  const p = document.getElementById("password");
  p.type = p.type === "password" ? "text" : "password";
}

/* 🔐 LOGIN */
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      showApp();
    })
    .catch(err => {
      alert("Error login: " + err.message);
    });
}
/* 🆕 REGISTER */
function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => {
      alert("Usuario creado ✅");
      showApp();
    })
    .catch(err => {
      alert("Error registro: " + err.message);
    });
}
/* 🚪 LOGOUT */
function logout() {
  auth.signOut().then(() => location.reload());
}

/* 👤 SESSION */
auth.onAuthStateChanged(user => {
  if (user) showApp();
});

function showApp() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  render();
  actualizarGrafica();
}

/* 🤖 IA EMOCIONAL */
function analizar(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("feliz") || texto.includes("genial") || texto.includes("bien"))
    return "feliz";

  if (texto.includes("triste") || texto.includes("mal") || texto.includes("solo"))
    return "triste";

  return "neutro";
}

document.getElementById("texto").addEventListener("input", e => {
  document.getElementById("iaResult").innerText =
    "Estado: " + analizar(e.target.value);
});

/* 💾 GUARDAR */
function guardar() {
  const texto = document.getElementById("texto").value;
  const file = document.getElementById("imagen").files[0];

  if (!texto) return;

  const emo = analizar(texto);

  const reader = new FileReader();

  reader.onload = function () {
    const entrada = {
      id: Date.now(),
      texto,
      imagen: reader.result || null,
      emocion: emo,
      fecha: new Date().toLocaleString()
    };

    entradas.unshift(entrada);
    localStorage.setItem("diario", JSON.stringify(entradas));

    actualizarGrafica();
    render();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
}

/* 🧾 RENDER */
function render() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  entradas.forEach(e => {
    lista.innerHTML += `
      <div class="card">
        <p>${e.texto}</p>
        <small>${e.emocion} • ${e.fecha}</small>

        ${e.imagen ? `<img src="${e.imagen}" style="width:100%; border-radius:10px;">` : ""}

        <button onclick="compartir(${e.id})">🔗 Compartir</button>
        <button onclick="story(${e.id})">📸 Story</button>
      </div>
    `;
  });
}

/* 🔗 COMPARTIR */
function compartir(id) {
  const e = entradas.find(x => x.id === id);
  const url = `${location.origin}${location.pathname}?id=${id}`;

  if (navigator.share) {
    navigator.share({
      title: "Mi reflexión",
      text: e.texto,
      url
    });
  } else {
    navigator.clipboard.writeText(url);
    alert("Copiado 🔗");
  }
}

/* 📸 STORY */
function story(id) {
  const e = entradas.find(x => x.id === id);

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, 1080, 1920);
  g.addColorStop(0, "#1f4037");
  g.addColorStop(1, "#99f2c8");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = "white";
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Mi reflexión", 540, 200);

  ctx.font = "40px Arial";

  let y = 500;
  let line = "";

  for (let w of e.texto.split(" ")) {
    const test = line + w + " ";
    if (test.length > 25) {
      ctx.fillText(line, 540, y);
      line = w + " ";
      y += 60;
    } else {
      line = test;
    }
  }

  ctx.fillText(line, 540, y);
  ctx.fillText("Emoción: " + e.emocion, 540, y + 120);
  ctx.font = "30px Arial";
  ctx.fillText(e.fecha, 540, y + 200);

  const a = document.createElement("a");
  a.download = "story.png";
  a.href = canvas.toDataURL();
  a.click();
}

/* 📊 GRÁFICA */
let chart;

function actualizarGrafica() {
  let data = { feliz: 0, neutro: 0, triste: 0 };

  entradas.forEach(e => data[e.emocion]++);

  const ctx = document.getElementById("grafica");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Feliz", "Neutro", "Triste"],
      datasets: [{ data: [data.feliz, data.neutro, data.triste] }]
    }
  });
}