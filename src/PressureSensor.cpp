#include "PressureSensor.hpp"

namespace industrial {

PressureSensor::PressureSensor(std::string n, double min, double max, double threshold)
    : BaseSensor(n, min, max, threshold)
{}

std::string PressureSensor::getUnit() const {
    return "bar";
}

}