
/* =========================
   📦 DATOS
========================= */
let entradas = JSON.parse(localStorage.getItem("diario")) || [];

/* =========================
   🤖 IA EMOCIONAL (LOCAL)
========================= */
function analizarEmocion(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("feliz") || texto.includes("genial") || texto.includes("bien") || texto.includes("contento")) {
    return "feliz";
  }

  if (texto.includes("triste") || texto.includes("mal") || texto.includes("solo") || texto.includes("deprimido")) {
    return "triste";
  }

  return "neutro";
}

/* LIVE IA */
document.getElementById("texto")?.addEventListener("input", (e) => {
  const emo = analizarEmocion(e.target.value);
  const el = document.getElementById("iaResult");
  if (el) el.innerText = "Estado detectado: " + emo;
});

/* =========================
   💾 GUARDAR ENTRADA
========================= */
function guardar() {
  const texto = document.getElementById("texto").value;
  const file = document.getElementById("imagen")?.files[0];

  if (!texto) return;

  const emocion = analizarEmocion(texto);

  const reader = new FileReader();

  reader.onload = function () {

    const entrada = {
      id: Date.now(),
      texto,
      imagen: reader.result || null,
      emocion,
      fecha: new Date().toISOString()
    };

    entradas.unshift(entrada);
    localStorage.setItem("diario", JSON.stringify(entradas));

    render();
    actualizarSemana();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
}

/* =========================
   🧾 RENDER
========================= */
function render() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  lista.innerHTML = "";

  entradas.forEach(e => {
    lista.innerHTML += `
      <div class="card">
        <p>${e.texto}</p>
        <small>${e.emocion} • ${new Date(e.fecha).toLocaleString()}</small>

        ${e.imagen ? `<img src="${e.imagen}" style="width:100%; border-radius:10px;">` : ""}

        <button onclick="compartir(${e.id})">🔗 Compartir</button>
        <button onclick="crearStory(${e.id})">📸 Story</button>
      </div>
    `;
  });
}

/* =========================
   🔗 COMPARTIR LINK
========================= */
function compartir(id) {
  const e = entradas.find(x => x.id === id);
  if (!e) return;

  const url = `${location.origin}${location.pathname}?id=${id}`;

  if (navigator.share) {
    navigator.share({
      title: "Mi reflexión",
      text: e.texto,
      url
    });
  } else {
    navigator.clipboard.writeText(url);
    alert("Enlace copiado 🔗");
  }
}

/* =========================
   📸 STORY (INSTAGRAM / WHATSAPP)
========================= */
function crearStory(id) {
  const entrada = entradas.find(e => e.id === id);
  if (!entrada) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1080;
  canvas.height = 1920;

  /* 🎨 Fondo */
  const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
  grad.addColorStop(0, "#0f2027");
  grad.addColorStop(0.5, "#203a43");
  grad.addColorStop(1, "#2c5364");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* 🧠 Título */
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "bold 70px Arial";
  ctx.fillText("💭 Mi reflexión", 540, 250);

  /* 💬 TEXTO */
  ctx.font = "50px Arial";

  const palabras = entrada.texto.split(" ");
  let linea = "";
  let y = 600;

  for (let i = 0; i < palabras.length; i++) {
    let test = linea + palabras[i] + " ";

    if (test.length > 20) {
      ctx.fillText(linea, 540, y);
      linea = palabras[i] + " ";
      y += 80;
    } else {
      linea = test;
    }
  }

  ctx.fillText(linea, 540, y);

  /* 😊 EMOCIÓN */
  ctx.font = "60px Arial";
  ctx.fillText(`Estado: ${entrada.emocion}`, 540, y + 150);

  /* 📅 FECHA */
  ctx.font = "35px Arial";
  ctx.fillText(new Date(entrada.fecha).toLocaleDateString(), 540, y + 230);

  /* 📥 DESCARGA */
  const link = document.createElement("a");
  link.download = "mi-reflexion-story.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* =========================
   📊 ESTADÍSTICAS SEMANALES
========================= */
function obtenerSemana() {
  const ahora = new Date();
  const hace7 = new Date();
  hace7.setDate(ahora.getDate() - 7);

  return entradas.filter(e => {
    const f = new Date(e.fecha);
    return f >= hace7 && f <= ahora;
  });
}

function calcularSemana() {
  let stats = { feliz: 0, neutro: 0, triste: 0 };

  obtenerSemana().forEach(e => {
    if (stats[e.emocion] !== undefined) {
      stats[e.emocion]++;
    }
  });

  return stats;
}

let chartSemana;

function renderSemana() {
  const ctx = document.getElementById("graficaSemana");
  if (!ctx) return;

  const stats = calcularSemana();

  if (chartSemana) chartSemana.destroy();

  chartSemana = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Feliz", "Neutro", "Triste"],
      datasets: [{
        label: "Últimos 7 días",
        data: [stats.feliz, stats.neutro, stats.triste]
      }]
    }
  });
}

function analisisSemana() {
  const stats = calcularSemana();
  const total = stats.feliz + stats.neutro + stats.triste;

  if (total === 0) return "Sin datos esta semana";

  const feliz = (stats.feliz / total) * 100;
  const triste = (stats.triste / total) * 100;

  if (feliz > 60) return "🟢 Semana positiva";
  if (triste > 50) return "🔴 Semana complicada";

  return "🟡 Semana equilibrada";
}

/* =========================
   🔄 UPDATE GENERAL
========================= */
function actualizarSemana() {
  const el = document.getElementById("analisisSemana");
  if (el) el.innerText = analisisSemana();

  renderSemana();
}

/* =========================
   🚀 INIT
========================= */
render();
actualizarSemana();