#ifndef TEMPERATURE_SENSOR_HPP
#define TEMPERATURE_SENSOR_HPP

#include "BaseSensor.hpp"
namespace industrial {
    
class TemperatureSensor : public BaseSensor{
    public:
        TemperatureSensor(std::string name, double min, double max, double threshold);

        std::string getUnit() const override;
    };
}

#endif