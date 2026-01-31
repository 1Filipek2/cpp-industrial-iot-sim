#include <iostream>  
#include "WebObserver.hpp"
#include <cpr/cpr.h>           
#include <nlohmann/json.hpp>    
#include <ctime>               
#include <thread>
#include <chrono>
#include <cstdlib>

namespace industrial {

void WebObserver::onAlarm(const std::string& sensorName, double value) {
    int maxRetries = 3;
    int attempt = 0;
    bool success = false;

    const char* env_key = std::getenv("IOT_API_KEY");
    std::string apiKey = env_key ? env_key : "MISSING_KEY";

    nlohmann::json payload = {
        {"sensor", sensorName},
        {"value", value},
        {"timestamp", std::time(nullptr)},
        {"status", "ALARM"}
    };

    while (attempt < maxRetries && !success) {
        try {
            auto response = cpr::Post(
                cpr::Url{apiUrl},
                cpr::Body{payload.dump()},
                cpr::Header{
                    {"Content-Type", "application/json"},
                    {"x-api-key", apiKey} 
                },
                cpr::Timeout{2000} 
            );

            if (response.status_code == 200) {
                std::cout << "\n[Network Success] Alarm sent to backend: " << sensorName << std::endl;
                success = true;
            } else if (response.status_code == 429) {
                attempt++;
                std::cerr << "[Warning] Rate limit (429). Retry attempt " << attempt << " in 2s..." << std::endl;
                std::this_thread::sleep_for(std::chrono::seconds(2));
            } else if (response.error) {
                std::cerr << "[Network Error] Failed to send alarm: " << response.error.message << std::endl;
                break; 
            } else {
                std::cerr << "[Server Error] Request rejected. Status: " << response.status_code << std::endl;
                break;
            }
        } catch (const std::exception& e) {
            std::cerr << "[Exception] Error processing alarm: " << e.what() << std::endl;
            break;
        }
    }
}

}