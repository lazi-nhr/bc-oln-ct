// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Admin.sol";

interface ITrack {
    struct Stop {
        uint256 time;
        int64 latitude;
        int64 longitude;
        uint8 status;
        address user;
    }

    function addStop(uint256 time, uint256 upi, uint8 status, int64 latitude, int64 longitude) external returns (bool);
    function getStops(uint256 upi) external view returns (Stop[] memory);
    function getProducts(address user) external view returns (uint256[] memory);
}

contract Track is ITrack {
    mapping(uint256 => Stop[]) private _stops;
    mapping(address => uint256[]) private _userToProducts;
    mapping(address => mapping(uint256 => bool)) private _ownedProducts;

    IAdmin public admin;

    // Role constants (mirroring Admin)
    uint8 constant ROLE_PRODUCER = 1;
    uint8 constant ROLE_SHIPPER = 3;

    // =========================
    //        MODIFIERS
    // =========================

    /// @notice Prevent contract-based calls
    modifier onlyEOA() {
        require(msg.sender == tx.origin, "Access denied: contract call");
        _;
    }

    /// @notice Only allow specific roles
    modifier onlyRoles(uint8 role1, uint8 role2) {
        IAdmin.User memory user = admin.getUser(msg.sender);
        require(user.role == role1 || user.role == role2, "Access denied: role mismatch");
        _;
    }

    /// @notice Validate timestamp and coordinates
    modifier validInput(uint256 time, int64 lat, int64 lon) {
        require(time > 0, "Invalid timestamp");
        require(lat != 0 && lon != 0, "Invalid coordinates");
        _;
    }

    /// @notice Validate UPI > 0
    modifier validUPI(uint256 upi) {
        require(upi > 0, "Invalid UPI");
        _;
    }

    constructor(address adminAddress) {
        admin = IAdmin(adminAddress);
    }

    function addStop(
        uint256 time,
        uint256 upi,
        uint8 status,
        int64 latitude,
        int64 longitude
    )
        public
        onlyEOA
        onlyRoles(ROLE_PRODUCER, ROLE_SHIPPER)
        validInput(time, latitude, longitude)
        validUPI(upi)
        returns (bool)
    {
        _stops[upi].push(Stop(time, latitude, longitude, status, msg.sender));

        if (!_ownedProducts[msg.sender][upi]) {
            _userToProducts[msg.sender].push(upi);
            _ownedProducts[msg.sender][upi] = true;
        }

        return true;
    }

    function getStops(uint256 upi) public view validUPI(upi) returns (Stop[] memory) {
        return _stops[upi];
    }

    function getProducts(address user) public view returns (uint256[] memory) {
        return _userToProducts[user];
    }
}
