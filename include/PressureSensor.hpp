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
    public:
        PressureSensor(std::string name, double min,double max);

        double getValue() override;
        std::string getName() const override;
    };


}

#endif