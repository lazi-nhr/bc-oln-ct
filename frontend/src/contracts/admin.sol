// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IAdmin {
    struct User {
        address account;
        string username;
        uint8 role;
    }

    struct Product {
        uint256 upi;
        string name;
    }

    function setUser(string memory username, uint8 role) external returns (bool);
    function getUser(address account) external view returns (User memory);
    function setProduct(string memory productName) external returns (uint256);
    function getProduct(uint256 upi) external view returns (Product memory);
}

contract Admin is IAdmin {
    uint8 constant ROLE_PRODUCER = 1;
    uint8 constant ROLE_RETAILER = 2;
    uint8 constant ROLE_SHIPPER = 3;
    uint8 constant ROLE_CUSTOMER = 4;

    mapping(address => User) private _users;
    mapping(uint256 => Product) private _products;
    uint256 private _productCount;

    modifier onlyRole(uint8 requiredRole) {
        require(_users[msg.sender].role == requiredRole, "Access denied: incorrect role");
        _;
    }

    constructor() {
        setUser("lazi", ROLE_PRODUCER);
        setProduct("Banana");
        setProduct("Apple");
    }

    function setUser(string memory username, uint8 role) public returns (bool) {
        require(_users[msg.sender].role == 0, "User already registered");
        require(role >= 1 && role <= 4, "Invalid role");
        _users[msg.sender] = User(msg.sender, username, role);
        return true;
    }

    function getUser(address account) public view returns (User memory) {
        return _users[account];
    }

    function setProduct(string memory productName) public onlyRole(ROLE_PRODUCER) returns (uint256) {
        _productCount++;
        _products[_productCount] = Product(_productCount, productName);
        return _productCount;
    }

    function getProduct(uint256 upi) public view returns (Product memory) {
        return _products[upi];
    }
}
