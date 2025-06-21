function calculerEtAfficherCourbe(doses) {
  const courbe = Array(60).fill(0);
  const labels = Array.from({ length: 60 }, (_, i) => {
    const heure = 6 + Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${heure}h${minute.toString().padStart(2, '0')}`;
  });

  console.log("📦 Doses reçues pour calcul :", doses);

  doses.forEach((d, i) => {
    const dose = parseFloat(d.dose);
    const [h, m] = d.heure.split("h").map(Number);
    const startIndex = ((h - 6) * 4) + Math.floor(m / 15);

    console.log(`🔹 Dose ${i + 1} :`, {
      raw: d,
      dose,
      heure: d.heure,
      h,
      m,
      startIndex
    });

    if (isNaN(dose) || isNaN(startIndex)) {
      console.warn(`⚠️ Dose ${i + 1} ignorée (valeurs non valides)`);
      return;
    }

    if (startIndex >= 0 && startIndex < courbe.length) {
      courbe[startIndex] += dose * 0.3;
      if (startIndex + 1 < courbe.length) courbe[startIndex + 1] += dose * 0.4;
      if (startIndex + 2 < courbe.length) courbe[startIndex + 2] += dose * 0.2;
      if (startIndex + 3 < courbe.length) courbe[startIndex + 3] += dose * 0.1;
    }
  });

  console.log("📈 Courbe finale :", courbe);

  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "mg dans le corps",
        data: courbe,
        borderColor: "blue",
        backgroundColor: "transparent",
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.2
      }]
    }
  });
}

// ✉️ Réception Thunkable
window.addEventListener("message", function(event) {
  try {
    console.log("✉️ Donnée brute reçue de Thunkable :", event.data);

    const doses = JSON.parse(event.data);
    console.log("✅ Donnée parsée en objet :", doses);

    calculerEtAfficherCourbe(doses);
  } catch (e) {
    console.error("❌ Erreur de parsing ou d'affichage :", e);
  }
});
