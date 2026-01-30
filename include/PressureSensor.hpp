#ifndef PRESSURE_SENSOR_HPP
#define PRESSURE_SENSOR_HPP

#include "BaseSensor.hpp"
namespace industrial {
class PressureSensor : public BaseSensor{
    public:
        PressureSensor(std::string name, double min,double max, double threshold);

        std::string getUnit() const override;
    };
}

#endif