// ENGINE HEALTH MONITORING SYSTEM
// Prototype rule-based screening logic.
// Thresholds are illustrative and must be calibrated using real vehicle data.

let records = [];

const vehicleNames = {
    FZS: "Yamaha FZ-S FI V4",
    RAYZR: "Yamaha RayZR 125 Fi Hybrid"
};

const fields = [
    "rpm",
    "speed",
    "temperature",
    "vibration",
    "voltage",
    "rpmVariation",
    "throttle",
    "intakeTemp",
    "oilTemp",
    "oilPressure",
    "fuel",
    "duration"
];

function getValue(id) {
    const element = document.getElementById(id);
    if (!element || element.value.trim() === "") return null;

    const value = Number(element.value);
    return Number.isFinite(value) ? value : null;
}

function getVehicle() {
    return document.getElementById("vehicle").value;
}

document.getElementById("vehicle").addEventListener("change", function () {
    document.getElementById("vehicleInfo").textContent =
        "Selected vehicle: " + vehicleNames[this.value];
});

function analyseHealth() {
    const rpm = getValue("rpm");
    const speed = getValue("speed");
    const temperature = getValue("temperature");
    const vibration = getValue("vibration");
    const voltage = getValue("voltage");
    const rpmVariation = getValue("rpmVariation");
    const throttle = getValue("throttle");
    const intakeTemp = getValue("intakeTemp");
    const oilTemp = getValue("oilTemp");
    const oilPressure = getValue("oilPressure");
    const fuel = getValue("fuel");
    const duration = getValue("duration");

    const required = {
        rpm, speed, temperature, vibration, voltage,
        rpmVariation, throttle, intakeTemp, oilTemp, duration
    };

    for (const [name, value] of Object.entries(required)) {
        if (value === null) {
            alert("Please enter a valid value for: " + name);
            return;
        }
    }

    if (
        rpm < 0 || speed < 0 || vibration < 0 ||
        rpmVariation < 0 || throttle < 0 || throttle > 100 ||
        duration <= 0
    ) {
        alert("Check the entered values. Some values are outside valid input ranges.");
        return;
    }

    let alerts = [];
    let assessments = [];
    let warningCount = 0;
    let dangerCount = 0;

    function assess(name, value, status, message) {
        assessments.push({
            name: name,
            value: value,
            status: status,
            message: message
        });

        if (status === "Warning") warningCount++;
        if (status === "Attention") dangerCount++;
    }

    // RPM screening
    if (rpm > 6000) {
        assess("Engine RPM", rpm + " RPM", "Warning",
            "High RPM. Compare with the manufacturer's operating limit.");
        alerts.push("High engine RPM detected.");
    } else {
        assess("Engine RPM", rpm + " RPM", "Normal",
            "No high-RPM alert from this screening rule.");
    }

    // Temperature screening
    if (temperature >= 110) {
        assess("Engine Surface Temperature", temperature + " °C",
            "Attention", "High temperature reading. Stop and inspect safely.");
        alerts.push("High engine surface temperature reading.");
    } else if (temperature >= 95) {
        assess("Engine Surface Temperature", temperature + " °C",
            "Warning", "Temperature is elevated. Check operating conditions.");
        alerts.push("Elevated engine surface temperature.");
    } else {
        assess("Engine Surface Temperature", temperature + " °C",
            "Normal", "No temperature alert from this screening rule.");
    }

    // Vibration screening
    if (vibration >= 5) {
        assess("Vibration RMS", vibration + " m/s²",
            "Attention", "High vibration reading. Inspect mounting and engine condition.");
        alerts.push("High vibration detected.");
    } else if (vibration >= 3) {
        assess("Vibration RMS", vibration + " m/s²",
            "Warning", "Elevated vibration. Compare with a known healthy baseline.");
        alerts.push("Elevated vibration detected.");
    } else {
        assess("Vibration RMS", vibration + " m/s²",
            "Normal", "No vibration alert from this screening rule.");
    }

    // Battery voltage screening
    if (voltage < 11.5) {
        assess("Battery Voltage", voltage + " V",
            "Attention", "Low voltage reading. Check battery and charging system.");
        alerts.push("Low battery voltage.");
    } else if (voltage < 12.2) {
        assess("Battery Voltage", voltage + " V",
            "Warning", "Voltage is below the illustrative reference level.");
        alerts.push("Battery voltage requires checking.");
    } else {
        assess("Battery Voltage", voltage + " V",
            "Normal", "No low-voltage alert from this screening rule.");
    }

    // RPM variation screening
    if (rpmVariation > 150) {
        assess("RPM Variation", rpmVariation + " RPM",
            "Attention", "Large RPM variation. Check idle stability and sensor quality.");
        alerts.push("Unstable RPM reading.");
    } else if (rpmVariation > 100) {
        assess("RPM Variation", rpmVariation + " RPM",
            "Warning", "RPM variation is elevated.");
        alerts.push("Elevated RPM variation.");
    } else {
        assess("RPM Variation", rpmVariation + " RPM",
            "Normal", "No RPM variation alert from this screening rule.");
    }

    // Intake air temperature: informational only
    assess("Intake Air Temperature", intakeTemp + " °C",
        "Recorded", "Record and compare under similar ambient conditions.");

    // Oil / crankcase temperature: informational only
    assess("Oil / Crankcase Temperature", oilTemp + " °C",
        "Recorded", "Interpret according to the actual sensor location.");

    // Optional fields: do not diagnose without validated limits
    if (oilPressure !== null) {
        assess("Oil Pressure", oilPressure + " kPa",
            "Recorded", "Compare with the vehicle service specification.");
    }

    if (fuel !== null) {
        assess("Fuel Consumption", fuel + " L/h",
            "Recorded", "Compare under the same speed and load conditions.");
    }

    assess("Vehicle Speed", speed + " km/h",
        "Recorded", "Vehicle speed recorded.");

    assess("Throttle Position", throttle + "%",
        "Recorded", "Throttle position recorded.");

    assess("Test Duration", duration + " seconds",
        "Recorded", "Test duration recorded.");

    let overallStatus = "NORMAL";
    let resultClass = "normal";
    let description = "No alert was triggered by the current screening rules.";

    if (dangerCount > 0) {
        overallStatus = "ATTENTION REQUIRED";
        resultClass = "danger";
        description = "One or more readings crossed an attention threshold. Inspect the vehicle and verify sensor readings.";
    } else if (warningCount > 0) {
        overallStatus = "WARNING";
        resultClass = "warning";
        description = "One or more readings are outside the illustrative normal range. Further checking is recommended.";
    }

    const result = document.getElementById("healthResult");
    result.className = "result " + resultClass;
    result.innerHTML = `
        <h3>${overallStatus}</h3>
        <p>${description}</p>
        <p><strong>Vehicle:</strong> ${vehicleNames[getVehicle()]}</p>
        <p><strong>Warnings:</strong> ${warningCount} |
        <strong>Attention alerts:</strong> ${dangerCount}</p>
    `;

    const alertBox = document.getElementById("alerts");

    if (alerts.length === 0) {
        alertBox.innerHTML = '<p class="alert">No alerts generated.</p>';
    } else {
        alertBox.innerHTML = alerts
            .map(alert => `<p class="alert">${alert}</p>`)
            .join("");
    }

    document.getElementById("assessmentTable").innerHTML =
        assessments.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.value}</td>
                <td><strong>${item.status}</strong><br>${item.message}</td>
            </tr>
        `).join("");

    const record = {
        date: new Date().toLocaleString(),
        vehicle: vehicleNames[getVehicle()],
        rpm,
        speed,
        temperature,
        vibration,
        voltage,
        status: overallStatus
    };

    records.push(record);
    updateRecords();
}

// SAMPLE DATA

function loadNormal() {
    setValues({
        rpm: 1500,
        speed: 20,
        temperature: 75,
        vibration: 1.5,
        voltage: 12.5,
        rpmVariation: 40,
        throttle: 20,
        intakeTemp: 32,
        oilTemp: 70,
        oilPressure: "",
        fuel: "",
        duration: 60
    });
}

function loadVibration() {
    setValues({
        rpm: 1800,
        speed: 25,
        temperature: 80,
        vibration: 4.2,
        voltage: 12.4,
        rpmVariation: 130,
        throttle: 25,
        intakeTemp: 34,
        oilTemp: 75,
        oilPressure: "",
        fuel: "",
        duration: 60
    });
}

function loadTemperature() {
    setValues({
        rpm: 2500,
        speed: 40,
        temperature: 105,
        vibration: 2.1,
        voltage: 12.3,
        rpmVariation: 50,
        throttle: 35,
        intakeTemp: 38,
        oilTemp: 95,
        oilPressure: "",
        fuel: "",
        duration: 60
    });
}

function loadBattery() {
    setValues({
        rpm: 1500,
        speed: 15,
        temperature: 78,
        vibration: 1.7,
        voltage: 11.2,
        rpmVariation: 45,
        throttle: 18,
        intakeTemp: 33,
        oilTemp: 72,
        oilPressure: "",
        fuel: "",
        duration: 60
    });
}

function setValues(data) {
    for (const [id, value] of Object.entries(data)) {
        document.getElementById(id).value = value;
    }
}

function resetForm() {
    loadNormal();

    document.getElementById("healthResult").className = "result neutral";
    document.getElementById("healthResult").innerHTML = `
        <h3>Waiting for Input</h3>
        <p>Enter sensor values and click Analyse Engine Health.</p>
    `;

    document.getElementById("alerts").innerHTML = "";
    document.getElementById("assessmentTable").innerHTML =
        '<tr><td colspan="3">No analysis performed yet.</td></tr>';
}

// ERROR CALCULATION

function calculateError() {
    const reference = getValue("referenceValue");
    const display = getValue("displayValue");
    const parameter = document.getElementById("parameterName").value;

    if (reference === null || display === null) {
        alert("Enter both reference and display values.");
        return;
    }

    const absoluteError = Math.abs(reference - display);

    let percentageError = "Not defined (reference is zero)";

    if (reference !== 0) {
        percentageError =
            ((absoluteError / Math.abs(reference)) * 100).toFixed(2) + "%";
    }

    document.getElementById("errorResult").innerHTML = `
        <h3>${parameter} Error Analysis</h3>
        <p>Reference Value: ${reference}</p>
        <p>Display Value: ${display}</p>
        <p>Absolute Error: ${absoluteError.toFixed(3)}</p>
        <p>Percentage Error: ${percentageError}</p>
    `;
}

// RECORD MANAGEMENT

function updateRecords() {
    const table = document.getElementById("recordsTable");

    if (records.length === 0) {
        table.innerHTML =
            '<tr><td colspan="8">No records available.</td></tr>';
        return;
    }

    table.innerHTML = records.map(record => `
        <tr>
            <td>${record.date}</td>
            <td>${record.vehicle}</td>
            <td>${record.rpm}</td>
            <td>${record.speed}</td>
            <td>${record.temperature}</td>
            <td>${record.vibration}</td>
            <td>${record.voltage}</td>
            <td>${record.status}</td>
        </tr>
    `).join("");
}

function exportCSV() {
    if (records.length === 0) {
        alert("No records available to export.");
        return;
    }

    const headings = [
        "Date and Time",
        "Vehicle",
        "RPM",
        "Speed (km/h)",
        "Temperature (C)",
        "Vibration RMS (m/s2)",
        "Battery Voltage (V)",
        "Health Status"
    ];

    const rows = records.map(record => [
        record.date,
        record.vehicle,
        record.rpm,
        record.speed,
        record.temperature,
        record.vibration,
        record.voltage,
        record.status
    ]);

    const csv = [headings, ...rows]
        .map(row => row.map(value =>
            '"' + String(value).replace(/"/g, '""') + '"'
        ).join(","))
        .join("\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "engine_health_records.csv";
    link.click();

    URL.revokeObjectURL(url);
}

function clearRecords() {
    if (confirm("Are you sure you want to clear all records?")) {
        records = [];
        updateRecords();
    }
}

// Load initial sample values
loadNormal();
