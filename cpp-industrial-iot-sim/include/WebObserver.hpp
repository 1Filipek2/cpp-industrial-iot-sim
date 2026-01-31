#ifndef WEBOBSERVER_HPP
#define WEBOBSERVER_HPP

#include "IObserver.hpp"
#include <string>

namespace industrial {

class WebObserver : public IObserver {
private:
    std::string apiUrl; 

public:
    WebObserver(std::string url) : apiUrl(url) {}

    void onAlarm(const std::string& sensorName, double value) override;
};

}

#endif