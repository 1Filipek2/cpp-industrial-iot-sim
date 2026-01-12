#include "TemperatureSensor.hpp"

namespace industrial {

TemperatureSensor::TemperatureSensor(std::string n, double min, double max) 
    : name(n), 
      gen(std::random_device{}()), 
      dist(min, max) 
{}

double TemperatureSensor::getValue() {
    return dist(gen);
}

std::string TemperatureSensor::getName() const {
    return name;
}

std::string TemperatureSensor::getUnit() const {
    return "C";
}

} 