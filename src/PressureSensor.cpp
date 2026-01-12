#include "PressureSensor.hpp"

namespace industrial {

PressureSensor::PressureSensor(std::string n, double min, double max)
    : name(n), 
      gen(std::random_device{}()), 
      dist(min, max) 
{}

double PressureSensor::getValue() {
    return dist(gen);
}

std::string PressureSensor::getName() const {
    return name;
}

std::string PressureSensor::getUnit() const {
    return "bar";
}

}