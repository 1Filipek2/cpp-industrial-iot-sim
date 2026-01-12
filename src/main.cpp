#include <iostream>
#include <vector>
#include <memory>
#include <iomanip>

#include "TemperatureSensor.hpp"
#include "PressureSensor.hpp"

int main () {
    std::vector<std::unique_ptr<industrial::ISensor>> sensors;

    sensors.push_back(std::make_unique<industrial::TemperatureSensor>("Main Boiler", 20.0, 100.0));
    sensors.push_back(std::make_unique<industrial::PressureSensor>("Hydraulic Pump", 0.0, 10.0));

    for(const auto& sensor : sensors) {
        std::cout << "Sensor: " << std::left << std::setw(15) << sensor->getName() 
          << " | Reading: " << std::fixed << std::setprecision(2) 
          << std::right << std::setw(6) << sensor->getValue() 
          << " " << sensor->getUnit() << std::endl;
    }
    return 0;
}