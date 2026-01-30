#include "Logger.hpp"

#include <iostream>
#include <iomanip>
#include <ctime>
namespace industrial {

Logger::Logger(std::string name) {
    logFile.open(name, std::ios::app);

    if(!logFile.is_open()) {
        std::cerr << "ERROR: Could not open log file: " << name << std::endl;
    }
} 

Logger::~Logger() {
    if(logFile.is_open()) {
        logFile.close();
    }
}

void Logger::log(const std::string& message) {
    if(logFile.is_open()) {
        std::time_t now = std::time(nullptr);
        std::tm* localTime = std::localtime(&now);

        logFile << "[" << std::put_time(localTime, "%Y-%m-%d %H:%M:%S") << "] " 
                << message << std::endl;
    }
}

void Logger::onAlarm(const std::string& sensorName, double value) {
    std::string msg = "ALARM: Sensor [" + sensorName + "] reached unsafe value: " + std::to_string(value);
    log(msg);
}

}