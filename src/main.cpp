#include <iostream>
#include <vector>
#include <memory>

#include "TemperatureSensor.hpp"
#include "PressureSensor.hpp"

int main () {
    std::vector<std::unique_ptr<industrial::ISensor>> sensors;

    sensors.push_back(std::make_unique<industrial::TemperatureSensor>("Main Boiler", 20.0, 100.0));
    sensors.push_back(std::make_unique<industrial::PressureSensor>("Hydraulic Pump", 0.0, 10.0));

    for(const auto& sensor : sensors) {
        std::cout << "Sensor: " << sensor->getName() 
          << " | Reading: " << sensor->getValue() << " C" << std::endl;
    }
    return 0;
}