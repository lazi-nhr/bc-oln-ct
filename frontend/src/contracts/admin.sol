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

    event ProductCreated(uint256 indexed upi, string name);
}

contract Admin is IAdmin {
    uint8 constant ROLE_PRODUCER = 1;
    uint8 constant ROLE_RETAILER = 2;
    uint8 constant ROLE_SHIPPER = 3;
    uint8 constant ROLE_CUSTOMER = 4;

    mapping(address => User) private _users;
    mapping(uint256 => Product) private _products;
    uint256 private _productCount;

    // ==============================
    //         MODIFIERS
    // ==============================

    /// @notice Ensure that only users with a specific role can access the function
    modifier onlyRole(uint8 requiredRole) {
        require(_users[msg.sender].role == requiredRole, "Access denied: incorrect role");
        _;
    }

    /// @notice Prevent calls from contracts (optional for public access functions)
    modifier onlyEOA() {
        require(msg.sender == tx.origin, "Access denied: contract call");
        _;
    }

    /// @notice Ensure that a string input is not empty
    modifier nonEmptyString(string memory str) {
        require(bytes(str).length > 0, "Input cannot be empty");
        _;
    }

    /// @notice Ensure that a user is not already registered
    modifier notRegistered() {
        require(_users[msg.sender].role == 0, "User already registered");
        _;
    }

    /// @notice Ensure that a user role is valid
    modifier validRole(uint8 role) {
        require(role >= 1 && role <= 4, "Invalid role");
        _;
    }

    constructor() {

    }

    function setUser(string memory username, uint8 role)
        public
        onlyEOA
        notRegistered
        validRole(role)
        nonEmptyString(username)
        returns (bool)
    {
        _users[msg.sender] = User(msg.sender, username, role);
        return true;
    }

    function getUser(address account) public view returns (User memory) {
        return _users[account];
    }

    function setProduct(string memory productName)
        public
        onlyEOA
        onlyRole(ROLE_PRODUCER)
        nonEmptyString(productName)
        returns (uint256)
    {
        _productCount++;
        _products[_productCount] = Product(_productCount, productName);
        emit ProductCreated(_productCount, productName);
        return _productCount;
    }

    function getProduct(uint256 upi) public view returns (Product memory) {
        return _products[upi];
    }
}
