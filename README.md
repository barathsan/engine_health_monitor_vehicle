# AI-Based Engine Health Monitoring System

## Project Overview


The website provides a prototype interface for entering sensor readings and screening engine health conditions.

## Parameters Monitored

- Engine RPM
- Vehicle Speed
- Engine Surface Temperature
- Vibration RMS
- Battery Voltage
- RPM Variation
- Throttle Position
- Intake Air Temperature
- Engine Oil / Crankcase Temperature
- Oil Pressure (optional)
- Fuel Consumption (optional)
- Test Duration

## Technologies Used

- HTML
- CSS
- JavaScript
- ESP32 / Arduino (planned hardware integration)
- External sensors

## Features

- Vehicle selection
- Manual sensor data input
- Engine health screening
- Abnormal parameter alerts
- Reference and display value comparison
- Absolute error calculation
- Percentage error calculation
- Sample test scenarios
- CSV report export

## Installation

1. Download or clone the repository.
2. Open `index.html` in a browser.
3. Select the vehicle.
4. Enter sensor values.
5. Click Analyse Engine Health.

## Future Development

- Graphical analysis
- Predictive maintenance

## Important Note

This is an academic prototype. The thresholds and sample readings are illustrative and have not been validated against Yamaha service specifications or real-world diagnostic datasets.

The current website uses rule-based screening, not a trained AI model. Actual diagnostic performance requires real sensor data, validated thresholds and testing.
