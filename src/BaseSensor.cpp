#include "BaseSensor.hpp"

namespace industrial {

BaseSensor::BaseSensor(std::string n, double min, double max, double threshold)
    : name(n),
      gen(std::random_device{}()),
      dist(min, max),
      safetyThreshold(threshold)  
{}

double BaseSensor::getValue() {
    lastValue = dist(gen);

    if (!isSafe()) {
        for (auto observer : observers) {
            observer->onAlarm(name, lastValue);
        }
    }
    return lastValue;
}

std::string BaseSensor::getName() const {
    return name;
}

bool BaseSensor::isSafe() const {
    return lastValue < safetyThreshold;
}

void BaseSensor::addObserver(IObserver* observer) {
    if(observer) { observers.push_back(observer); }
}

}