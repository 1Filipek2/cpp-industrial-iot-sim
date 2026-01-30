#ifndef BASESENSOR_HPP
#define BASESENSOR_HPP

#include "ISensor.hpp"
#include "IObserver.hpp"
#include <string>
#include <random>
#include <vector>

namespace industrial {

class BaseSensor : public ISensor{
    protected:
        std::string name;
        std::mt19937 gen;
        std::uniform_real_distribution<double> dist;
        double lastValue = 0.0;
        double safetyThreshold;

        std::vector<IObserver*> observers;

    public:
        BaseSensor(std::string name, double min, double max, double threshold);

        std::string getName() const override;
        bool isSafe() const override;
        double getValue() override;
        
        void addObserver(IObserver* observer);
    };
}

#endif