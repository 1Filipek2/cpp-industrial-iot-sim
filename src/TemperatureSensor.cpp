#include "TemperatureSensor.hpp"

namespace industrial {

TemperatureSensor::TemperatureSensor(std::string n, double min, double max, double threshold) 
    : BaseSensor(n, min, max, threshold)
{}

std::string TemperatureSensor::getUnit() const {
    return "C";
}

} 