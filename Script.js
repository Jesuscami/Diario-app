
/* =========================
   📦 DATOS
========================= */
let entradas = JSON.parse(localStorage.getItem("diario")) || [];

/* =========================
   🤖 IA SIMPLE
========================= */
function analizarEmocion(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("feliz") || texto.includes("bien") || texto.includes("genial")) {
    return "feliz";
  }

  if (texto.includes("triste") || texto.includes("mal") || texto.includes("solo")) {
    return "triste";
  }

  return "neutro";
}

/* LIVE IA */
document.getElementById("texto").addEventListener("input", (e) => {
  const emo = analizarEmocion(e.target.value);
  document.getElementById("iaResult").innerText = "Estado: " + emo;
});

/* =========================
   💾 GUARDAR ENTRADA
========================= */
function guardar() {
  const texto = document.getElementById("texto").value;
  if (!texto) return;

  const emocion = analizarEmocion(texto);

  const entrada = {
    id: Date.now(),
    texto,
    emocion,
    fecha: new Date().toISOString()
  };

  entradas.unshift(entrada);
  localStorage.setItem("diario", JSON.stringify(entradas));

  render();
  actualizarSemana();
}

/* =========================
   📅 FILTRAR SEMANA
========================= */
function obtenerSemana() {
  const ahora = new Date();
  const hace7 = new Date();
  hace7.setDate(ahora.getDate() - 7);

  return entradas.filter(e => {
    const fecha = new Date(e.fecha);
    return fecha >= hace7 && fecha <= ahora;
  });
}

/* =========================
   📊 ESTADÍSTICAS SEMANALES
========================= */
function calcularSemana() {
  const semana = obtenerSemana();

  let stats = {
    feliz: 0,
    neutro: 0,
    triste: 0
  };

  semana.forEach(e => {
    if (stats[e.emocion] !== undefined) {
      stats[e.emocion]++;
    }
  });

  return stats;
}

/* =========================
   🧠 ANÁLISIS SALUD MENTAL
========================= */
function analisisSemana() {
  const stats = calcularSemana();
  const total = stats.feliz + stats.neutro + stats.triste;

  if (total === 0) return "No hay datos esta semana";

  const feliz = (stats.feliz / total) * 100;
  const triste = (stats.triste / total) * 100;

  if (feliz > 60) return "🟢 Semana positiva: buen estado emocional";
  if (triste > 50) return "🔴 Semana complicada: cuidado emocional";

  return "🟡 Semana equilibrada con altibajos";
}

/* =========================
   📊 GRÁFICA SEMANAL
========================= */
let chartSemana;

function renderSemana() {
  const stats = calcularSemana();

  const ctx = document.getElementById("graficaSemana");

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

/* =========================
   🧾 RENDER LISTA
========================= */
function render() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  entradas.forEach(e => {
    lista.innerHTML += `
      <div style="background:#222;padding:10px;margin:10px;border-radius:10px;">
        <p>${e.texto}</p>
        <small>${e.emocion} • ${new Date(e.fecha).toLocaleString()}</small>
      </div>
    `;
  });
}

/* =========================
   🔄 ACTUALIZAR TODO
========================= */
function actualizarSemana() {
  document.getElementById("analisisSemana").innerText = analisisSemana();
  renderSemana();
}

/* =========================
   🚀 INIT
========================= */
render();
actualizarSemana();