# Full-Stack Industrial IoT Ecosystem

A distributed monitoring system integrating a C++ simulation engine, a Node.js cloud API, and a React-based real-time dashboard.

---

## Architecture Overview

The system implements a complete data pipeline across four distinct environments:

* **Edge Simulator:** C++17 application (Fedora Linux)
* **Cloud Backend:** Node.js & Express (Render.com)
* **Database:** MongoDB Atlas (NoSQL)
* **Frontend:** React & Tailwind CSS (Vercel)

**Links:**
* [Live Dashboard](https://cpp-industrial-iot-sim.vercel.app/)
* [API Endpoint](https://iot-backend-filip.onrender.com/api/alarms)

---

## Technical Specifications

### C++ Edge Simulator
* **Design Pattern:** Observer pattern decouples sensor logic from reporting.
* **Polymorphism:** Abstract `ISensor` interface for extensible sensor types.
* **Networking:** Asynchronous HTTP communication via `libcpr`.

### Cloud & Frontend
* **REST API:** Secure endpoints for data ingestion and administrative control.
* **Data Visualization:** Time-series charts implemented with Recharts.
* **Infrastructure:** Automated CI/CD pipelines via GitHub integration.

---

## Stack Summary

| Component   | Technology |
|:-----------|:-----------|
| Languages  | C++17, JavaScript (ES6+) |
| Libraries  | libcpr, nlohmann/json, Axios, Recharts |
| Backend    | Node.js, Express, Mongoose |
| Database   | MongoDB Atlas |
| Deployment | GitHub Actions, Render, Vercel |

---

## Installation & Usage

### C++ Simulator
Requires `cmake`, `g++`, and `libcurl`:

```bash
mkdir build && cd build
cmake ..
make
./sensor_sim