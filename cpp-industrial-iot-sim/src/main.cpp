#include <iostream>
#include <vector>
#include <memory>
#include <iomanip>
#include <thread>
#include <chrono>

#include "TemperatureSensor.hpp"
#include "PressureSensor.hpp"
#include "Logger.hpp"
#include "WebObserver.hpp"

int main () {
    auto boiler = std::make_unique<industrial::TemperatureSensor>("Main Boiler", 20.0, 100.0, 80.0);
    auto pump = std::make_unique<industrial::PressureSensor>("Hydraulic Pump", 0.0, 10.0, 8.5);
    
    industrial::Logger logger("alarms.log");
    industrial::WebObserver webServer("https://iot-backend-filip.onrender.com");

    boiler->addObserver(&logger);
    boiler->addObserver(&webServer); 

    pump->addObserver(&logger);
    pump->addObserver(&webServer);

    std::vector<std::unique_ptr<industrial::ISensor>> sensors;
    sensors.push_back(std::move(boiler));
    sensors.push_back(std::move(pump));

    while (true) {
        std::cout << "\033[2J\033[1;1H";
        std::cout << "--- Industrial IoT Monitor (Ctrl+C to stop) ---" << std::endl << std::endl;

        try {
            for(const auto& sensor : sensors) {
                double val = sensor->getValue(); 
                bool unsafe = !sensor->isSafe();

                if(unsafe) std::cout << "\033[1;31m[ALARM] ";

                std::cout << "Sensor: " << std::left << std::setw(15) << sensor->getName() 
                        << " | Reading: " << std::fixed << std::setprecision(2) 
                        << std::right << std::setw(6) << val 
                        << " " << sensor->getUnit();

                if(unsafe) std::cout << "\033[0m";
                std::cout << std::endl;
            }
            std::this_thread::sleep_for(std::chrono::seconds(60));
        }
        catch(const std::exception& e) {
            std::cerr << "Critical error: " << e.what() << std::endl;
            break;
        }
    }
    return 0;
}