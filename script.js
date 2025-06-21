function calculerEtAfficherCourbe(doses) {
  const courbe = Array(60).fill(0); // de 6h00 à 21h45 par pas de 15min
  const labels = Array.from({ length: 60 }, (_, i) => {
    const heure = 6 + Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${heure}h${minute.toString().padStart(2, '0')}`;
  });

  doses.forEach(d => {
    const dose = Number(d.dose);
    const [h, m] = d.heure.split("h").map(Number);
    const startIndex = ((h - 6) * 4) + Math.floor(m / 15);
    if (startIndex >= 0 && startIndex < courbe.length) {
      courbe[startIndex] += dose * 0.3;
      if (startIndex + 1 < courbe.length) courbe[startIndex + 1] += dose * 0.4;
      if (startIndex + 2 < courbe.length) courbe[startIndex + 2] += dose * 0.2;
      if (startIndex + 3 < courbe.length) courbe[startIndex + 3] += dose * 0.1;
    }
  });

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
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
