#ifndef VIBRATION_SENSOR_HPP
#define VIBRATION_SENSOR_HPP

#include "BaseSensor.hpp"

namespace industrial {

class VibrationSensor : public BaseSensor{
    public:
        VibrationSensor(std::string name, double min, double max, double threshold);

        std::string getUnit() const override;
    };
}

#endif