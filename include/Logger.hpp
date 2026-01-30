#ifndef LOGGER_HPP
#define LOGGER_HPP

#include "IObserver.hpp"
#include <string>
#include <fstream>
namespace industrial {
class Logger : public IObserver {
    private:
        std::ofstream logFile;
    public:
        Logger(std::string name);
        virtual ~Logger();

        void log(const std::string& message);

        virtual void onAlarm(const std::string& sensorName, double value) override;
};

}

#endif