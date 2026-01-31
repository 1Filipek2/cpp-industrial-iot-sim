#include "VibrationSensor.hpp"

namespace industrial {

VibrationSensor::VibrationSensor(std::string n, double min, double max, double threshold)
    : BaseSensor(n, min,max, threshold)
{}

std::string VibrationSensor::getUnit() const {
    return "g";
}
}