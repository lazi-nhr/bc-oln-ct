// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ITrack {
    // Stop struct to store stop information
    struct Stop {
        uint256 time;
        int64 latitude; // has the format 40712776, e.g. 40.712776 E
        int64 longitude; // has the format -74005974, e.g. 74.005974 W
        uint8 status;
        address user;
    }

    function addStop(uint256 time, uint256 upi, uint8 status, int64 latitude, int64 longitude) external returns (bool);
    function getStops(uint256 upi) external view returns (Stop[] memory);
}


contract Track is ITrack {

    // Mapping of product UPI numbers to stop information
    mapping(uint256 => Stop[]) private _stops;

    // Constructor to initialize the contract with default stops
    constructor() {
        addStop(1734875447, 1, 1, 40712776, -74005974);
        addStop(1734875447, 1, 2, 60712776, -34005974);
        addStop(1735566647, 1, 3, 31712776, 20005974);
        addStop(1746017447, 1, 4, 80712776, -21005974);

        addStop(1734529847, 2, 3, 40712776, -74005974);
        addStop(1734875447, 2, 3, 60712776, -34005974);
        addStop(1735566647, 2, 4, 31712776, 20005974);
        addStop(1735566647, 2, 4, 31712776, 20005974);
        addStop(1746017447, 2, 5, 80712776, -21005974);

        addStop(1735566647, 3, 1, 40712776, -74005974);
        addStop(1735566647, 3, 3, 60712776, -34005974);
        addStop(1746017447,3, 5, 80712776, -21005974);
    }

    // Add a stop to the product
    function addStop(
        uint256 time, uint256 upi, uint8 status, int64 latitude, int64 longitude) public returns (bool) {
        _stops[upi].push(Stop(time, latitude, longitude, status, msg.sender));
        return true;
    }

    // Get the stops for a product
    function getStops(uint256 upi) public view returns (Stop[] memory) {
        return _stops[upi];
    }
}