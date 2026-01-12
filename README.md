# Industrial IoT Sensor Simulator

A **C++17** simulation tool designed to replicate industrial monitoring environments. The project demonstrates advanced **Object-Oriented Programming (OOP)** principles, real-time data simulation, safety monitoring, and persistent system logging.

---

## Key Features

* **Polymorphic Architecture**
  Uses an `ISensor` interface to support multiple sensor types (e.g. Temperature, Pressure) via polymorphism.

* **Real-time Monitoring**
  Continuous simulation loop with dynamic terminal updates.

* **Safety & Alarms**
  Automatic detection of out-of-range values with clear visual alerts using ANSI terminal colors.

* **Persistent Logging**
  High-precision logging of critical events with system timestamps.

* **Modern C++ Standards**
  Memory-safe design using `std::unique_ptr` and random data generation via `<random>`.

---

## Build Instructions

This project uses **CMake** for simple, cross-platform compilation.

1. **Create a build directory**:

   ```bash
   mkdir build && cd build
   ```

2. **Generate build files**:

   ```bash
   cmake ..
   ```

3. **Compile the project**:

   ```bash
   make
   ```

4. **Run the simulator**:

   ```bash
   ./sensor_sim
   ```

---

## Example Dashboard Output

When running, the terminal displays a real-time monitoring dashboard. If a sensor exceeds its safety threshold, a red **[ALARM]** tag is shown:

```
--- Industrial IoT Monitor (Ctrl+C to stop) ---

[ALARM] Sensor: Main Boiler     | Reading:  97.42 C
Sensor: Hydraulic Pump         | Reading:   1.83 bar
```

---

## Logging System

All alarm events are automatically saved to **`alarms.log`** in the project root directory. This ensures a persistent history of critical system events, even after the application is closed.

### View the logs

To display recorded alarms, use:

```bash
cat alarms.log
```

### Example log entries

```
[2026-01-13 00:20:32] ALARM: Main Boiler - Value: 97.419054
[2026-01-13 00:20:35] ALARM: Main Boiler - Value: 88.470388
```

---

## Project Structure

```
.
├── include/        # Header files (.hpp) defining interfaces and classes
├── src/            # Implementation files (.cpp)
├── CMakeLists.txt  # Build configuration
├── alarms.log      # Generated log file (created after first alarm)
├── docs/           # Future technical documentation and architecture diagrams
├── tests/          # Placeholder for future unit tests (e.g., GTest/Catch2)
└── README.md       # Project documentation
```

---

## Notes

* Stop the simulation anytime using **Ctrl + C**.
* The project is intended for educational and demonstration purposes, showcasing clean OOP design and modern C++ practices.
