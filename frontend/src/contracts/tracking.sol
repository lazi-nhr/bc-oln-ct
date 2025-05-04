//SPDX-License-Identifier: MIT
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

    uint8 constant ROLE_PRODUCER = 1;
    uint8 constant ROLE_SHIPPER = 3;

    constructor(address adminAddress) {
        admin = IAdmin(adminAddress);
    }

    /*constructor() {
        addStop(1734875447, 1, 1, 40712776, -74005974);
        addStop(1734875447, 1, 2, 60712776, -34005974);
        addStop(1735566647, 1, 3, 31712776, 20005974);
        addStop(1746017447, 1, 4, 80712776, -21005974);

        addStop(1734529847, 2, 3, 40712776, -74005974);
        addStop(1734875447, 2, 3, 60712776, -34005974);
        addStop(1735566647, 2, 4, 31712776, 20005974);
        addStop(1735566647, 2, 4, 31712776, 20005974);
        addStop(1746017447, 2, 5, 80712776, -21005974);
    }*/

    modifier onlyRoles(uint8 role1, uint8 role2) {
        IAdmin.User memory user = admin.getUser(msg.sender);
        require(user.role == role1 || user.role == role2, "Access denied");
        _;
    }

    function addStop(
        uint256 time,
        uint256 upi,
        uint8 status,
        int64 latitude,
        int64 longitude
    ) public onlyRoles(ROLE_PRODUCER, ROLE_SHIPPER) returns (bool) {
        _stops[upi].push(Stop(time, latitude, longitude, status, msg.sender));

        if (!_ownedProducts[msg.sender][upi]) {
            _userToProducts[msg.sender].push(upi);
            _ownedProducts[msg.sender][upi] = true;
        }

        return true;
    }

    function getStops(uint256 upi) public view returns (Stop[] memory) {
        return _stops[upi];
    }

    function getProducts(address user) public view returns (uint256[] memory) {
        return _userToProducts[user];
    }
}


