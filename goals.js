async function getData() {
    try {
        const response = await fetch('matches.csv');
        const data = await response.text(); 

        const rows = data.split('\n').slice(1); 
        const teamGoals = {};

        rows.forEach((row, index) => {
            if (!row.trim()) return;
            const columns = row.split(',');
            if (columns.length < 4) {
                console.warn(`Skipping row ${index + 1}: Invalid format`, row);
                return;
            }

            const team = columns[3];
            teamGoals[team] = (teamGoals[team] || 0) + 1;
        });

        createChart(teamGoals); 
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

function createChart(teamGoals) {
    const ctx = document.getElementById('goalsChart').getContext('2d');
    const teams = Object.keys(teamGoals); 
    const goals = Object.values(teamGoals); 

    console.log("Teams:", teams);
    console.log("Goals:", goals);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams, 
            datasets: [{
                label: 'Goals Scored',
                data: goals, 
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Goals Scored Per Team (All Matches)',
                    font: {
                        size: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

getData();
