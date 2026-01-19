fetch(`/api/latest/?t=${Date.now()}`)

function blink(id) {
    const el = document.getElementById(id);
    el.classList.remove('blink');
    void el.offsetWidth; // reset animation
    el.classList.add('blink');
}

async function loadData() {
    const res = await fetch('/api/data/');
    const data = await res.json();

    if (data.temperature !== undefined) {
        updateValue('temp', data.temperature, 'temperature');
        updateValue('hum', data.humidity, 'humidity');
        updateValue('pres', data.pressure, 'pressure');
    }
}

function updateValue(id, value, type) {
    const el = document.getElementById(id);

    if (el.innerText !== String(value)) {
        el.innerText = value;
        blink(id);
        applyAlarmColor(el, value, type);
    }
}

setInterval(loadData, 3000);
loadData();

function applyAlarmColor(el, value, type) {
    el.classList.remove('red', 'green');

    if (type === 'temperature') {
        value > 30 ? el.classList.add('red') : el.classList.add('green');
    }

    if (type === 'humidity') {
        (value < 30 || value > 70)
            ? el.classList.add('red')
            : el.classList.add('green');
    }

    if (type === 'pressure') {
        value < 1000 ? el.classList.add('red') : el.classList.add('green');
    }
}

let chart;

async function loadChart() {
    const res = await fetch('/api/history/');
    const data = await res.json();

    const ctx = document.getElementById('sensorChart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: data.temperature,
                    borderWidth: 2,
                    tension: 0.4,
                },
                {
                    label: 'Humidity (%)',
                    data: data.humidity,
                    borderWidth: 2,
                    tension: 0.4,
                },
                {
                    label: 'Pressure (hPa)',
                    data: data.pressure,
                    borderWidth: 2,
                    tension: 0.4,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                }
            },
            scales: {
                x: {
                    ticks: { color: 'white' },
                    grid: { color: '#333' }
                },
                y: {
                    ticks: { color: 'white' },
                    grid: { color: '#333' }
                }
            }
        }
    });
}

setInterval(loadChart, 5000);
loadChart();
