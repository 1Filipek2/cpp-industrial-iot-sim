cmake_minimum_required(VERSION 3.10)
project(IndustrialIoTSimulator)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

add_executable(sensor_sim 
    src/main.cpp 
    src/TemperatureSensor.cpp 
    src/PressureSensor.cpp 
    src/Logger.cpp
    src/BaseSensor.cpp
)