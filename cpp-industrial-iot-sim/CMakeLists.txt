cmake_minimum_required(VERSION 3.11)
project(IndustrialIoTSimulator)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)
FetchContent_MakeAvailable(json)

set(BUILD_CPR_TESTS OFF CACHE INTERNAL "")
FetchContent_Declare(
    cpr
    GIT_REPOSITORY https://github.com/libcpr/cpr.git
    GIT_TAG 1.10.x
)
FetchContent_MakeAvailable(cpr)

include_directories(include)

add_executable(sensor_sim 
    src/main.cpp 
    src/TemperatureSensor.cpp 
    src/PressureSensor.cpp 
    src/Logger.cpp
    src/BaseSensor.cpp
    src/WebObserver.cpp 
)

target_link_libraries(sensor_sim PRIVATE 
    nlohmann_json::nlohmann_json 
    cpr::cpr
)