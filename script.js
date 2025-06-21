<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Courbe Ritaline</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: sans-serif;
      padding: 0;
      margin: 0;
    }
    #chart-container {
      width: 100%;
      height: 400px;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="chart-container">
    <canvas id="myChart"></canvas>
  </div>
  <script>
    function calculerCourbe(doses) {
      const courbe = Array(60).fill(0); // 60 points = 6h00 à 21h45
      const labels = Array.from({ length: 60 }, (_, i) => {
        const heure = 6 + Math.floor(i / 4);
        const minute = (i % 4) * 15;
        return `${heure}h${minute.toString().padStart(2, '0')}`;
      });

      doses.forEach(d => {
        const dose = Number(d.dose);
        const [heureStr, minuteStr] = d.heure.split("h");
        const heure = parseInt(heureStr);
        const minute = parseInt(minuteStr);
        const debut = ((heure - 6) * 4) + Math.floor(minute / 15);
        if (isNaN(debut) || isNaN(dose)) return;

        for (let i = 0; i < 20 && debut + i < courbe.length; i++) {
          const effet = dose * Math.exp(-i / 5); // décroissance exponentielle
          courbe[debut + i] += effet;
        }
      });

      return { labels, data: courbe };
    }

    function updateChart(labels, data) {
      if (window.myChart) {
        window.myChart.data.labels = labels;
        window.myChart.data.datasets[0].data = data;
        window.myChart.update();
      } else {
        const ctx = document.getElementById('myChart').getContext('2d');
        window.myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'mg dans le corps',
              data: data,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "mg dans le corps" }
              },
              x: {
                title: { display: true, text: "Heure" }
              }
            }
          }
        });
      }
    }

    window.addEventListener("message", (event) => {
      console.log("📨 Données reçues : ", event.data);
      try {
        const doses = JSON.parse(event.data);
        console.log("🔎 Objet JSON parsé :", doses);
        doses.forEach((d, i) => {
          console.log(`➡️ Dose ${i} :`, d);
          console.log(`   → d.dose (type ${typeof d.dose}) =`, d.dose);
          console.log(`   → d.heure =`, d.heure);
        });
        const { labels, data } = calculerCourbe(doses);
        updateChart(labels, data);
      } catch (error) {
        console.error("❌ Erreur de parsing JSON :", error);
      }
    });
  </script>
</body>
</html>
