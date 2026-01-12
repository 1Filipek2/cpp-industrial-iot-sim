#include "TemperatureSensor.hpp"

namespace industrial {

TemperatureSensor::TemperatureSensor(std::string n, double min, double max) 
    : name(n), 
      gen(std::random_device{}()), 
      dist(min, max) 
{}

double TemperatureSensor::getValue() {
    lastValue = dist(gen);
    return lastValue;
}

std::string TemperatureSensor::getName() const {
    return name;
}

std::string TemperatureSensor::getUnit() const {
    return "C";
}

bool TemperatureSensor::isSafe () const {
    return lastValue < 80.0;
}

} 