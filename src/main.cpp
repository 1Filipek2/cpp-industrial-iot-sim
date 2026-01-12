#include <iostream>
#include <vector>
#include <memory>
#include <iomanip>

#include "TemperatureSensor.hpp"
#include "PressureSensor.hpp"

int main () {
    std::vector<std::unique_ptr<industrial::ISensor>> sensors;

    try
    {
        sensors.push_back(std::make_unique<industrial::TemperatureSensor>("Main Boiler", 20.0, 100.0));
        sensors.push_back(std::make_unique<industrial::PressureSensor>("Hydraulic Pump", 0.0, 10.0));

        for(const auto& sensor : sensors) {
            double val = sensor->getValue();

            bool unsafe = !sensor->isSafe();

            if(unsafe) {
                std::cout << "\033[1;31m[ALARM] ";
            }

            std::cout << "Sensor: " << std::left << std::setw(15) << sensor->getName() 
                      << " | Reading: " << std::fixed << std::setprecision(2) 
                      << std::right << std::setw(6) << val 
                      << " " << sensor->getUnit();

            if(unsafe) {
                std::cout << "\033[0m";
            }
            std::cout << std::endl;
        }
    }
    catch(const std::exception& e)
    {
        std::cerr << e.what() << std::endl;
    }
    
    return 0;
}