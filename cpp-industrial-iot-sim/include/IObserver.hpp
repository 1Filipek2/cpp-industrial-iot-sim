#ifndef IOBSERVER_HPP
#define IOBSERVER_HPP

#include <string>

namespace industrial {

class IObserver {
    public:    
        virtual void onAlarm(const std::string& sensorName, double value) = 0;
        virtual ~IObserver() = default;
    };

}

#endif IOBSERVER_HPP