#include "PressureSensor.hpp"

namespace industrial {

PressureSensor::PressureSensor(std::string n, double min, double max)
    : name(n), 
      gen(std::random_device{}()), 
      dist(min, max) 
{}

double PressureSensor::getValue() {
    lastValue = dist(gen);
    return lastValue;
}

std::string PressureSensor::getName() const {
    return name;
}

std::string PressureSensor::getUnit() const {
    return "bar";
}

bool PressureSensor::isSafe () const {
    return lastValue < 8.0;
}

}