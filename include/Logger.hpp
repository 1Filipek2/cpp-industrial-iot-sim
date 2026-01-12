#ifndef LOGGER_HPP
#define LOGGER_HPP

#include <string>
#include <fstream>

class Logger {
    private:
        std::ofstream logFile;
    public:
        Logger(std::string name);
        virtual ~Logger();

        void log(const std::string& message);
};

#endif