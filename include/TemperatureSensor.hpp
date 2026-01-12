#ifndef TEMPERATURE_SENSOR_HPP
#define TEMPERATURE_SENSOR_HPP

#include "ISensor.hpp"
#include <string>
#include <random>

namespace industrial {
    
class TemperatureSensor : public ISensor{
    private:
        std::string name;
        std::mt19937 gen;
        std::uniform_real_distribution<double> dist;
    public:
        TemperatureSensor(std::string name, double min, double max);

        double getValue() override;
        std::string getName() const override;
        std::string getUnit() const override;
    };
}

#endif