#include "TemperatureSensor.hpp"

namespace industrial {

TemperatureSensor::TemperatureSensor(std::string n, double min, double max) : name(n), dist(min,max), gen(std::random_device{}()){}


double TemperatureSensor::getValue() {
    return dist(gen);
}

std::string TemperatureSensor::getName() const {
    return  name;
}
}