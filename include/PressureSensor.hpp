#ifndef PRESSURE_SENSOR_HPP
#define PRESSURE_SENSOR_HPP

#include "ISensor.hpp"
#include <string>
#include <random>

namespace industrial {

class PressureSensor : public ISensor{
    private:
        std::string name;
        std::mt19937 gen;
        std::uniform_real_distribution<double> dist;
        double lastValue = 0.0;
    public:
        PressureSensor(std::string name, double min,double max);

        double getValue() override;
        std::string getName() const override;
        std::string getUnit() const override;
        bool isSafe() const override;
    };
}

#endif