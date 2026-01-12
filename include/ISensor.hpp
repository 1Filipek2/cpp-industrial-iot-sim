#ifndef ISENSOR_HPP
#define ISENSOR_HPP

#include <string>

namespace industrial {
    
class ISensor{
    public:
        virtual ~ISensor() = default;
        virtual double getValue() = 0;
        virtual std::string getName() const = 0;
    };
}

#endif