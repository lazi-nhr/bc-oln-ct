// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Interface to interact with the Admin contract
interface IAdmin {
    // Product struct to store product information
    struct Product {
        uint256 upi;
        string name;
    }

    // User data structure to store user information
    struct User {
        address account;
        string username;
        uint8 role;
        uint256[] products;
    }

    // User Management
    function setUser(string memory username, uint8 role) external returns (bool);
    function getUser(address account) external view returns (User memory);
    function assignProduct(uint256 upi) external returns (bool);
    function getProducts(address account) external view returns (uint256[] memory);

    // Product Management
    function setProduct(string memory productName) external returns (uint256);
    function getProduct(uint256 upi) external view returns (Product memory);
}


contract Admin is IAdmin {
    // Mapping of user addresses to User structs
    mapping(address => User) private _users;

    // Mapping of product UPI numbers to product names
    mapping(uint256 => Product) private _products;

    // Product count to assign unique product identifier (UPI)
    uint256 private _productCount;

    // Constructor to initialize the contract with default users and products
    constructor() {
        setUser("lazi", 1);
        setProduct("Real-Banana");
        setProduct("Apple");
        setProduct("Orange");
    }

    // Set a user's username and role
    function setUser(string memory username, uint8 role) public returns (bool) {
        // Check if the user already exists
        require(_users[msg.sender].role == 0, "User already registered");

        // Check if the role is valid
        // 1 = Buyer, 2 = Retailer, 3 = Distributor, 4 = Manufacturer, 5 = Quality Control, 0 = Not registered
        require(role > 0 || role < 6, "Invalid role");

        // Set the user's username and role
        _users[msg.sender] = User(msg.sender, username, role, new uint256[](0));
        return true;
    }

    // Get a user's username, role and products
    function getUser(address account) public view returns (User memory) {
        return _users[account];
    }

    // Assign a product to a user
    function assignProduct(uint256 upi) public returns (bool) {
        require(_users[msg.sender].role != 0, "User is not registered");
        _users[msg.sender].products.push(upi);
        return true;
    }

    // Get a user's assigned products
    function getProducts(address account) public view returns (uint256[] memory) {
        return _users[account].products;
    }

    // Set a product name and assign a unique UPI number
    function setProduct(string memory productName) public returns (uint256) {
        // Increment the product count
        _productCount++;
        // Assign the product to the user
        assignProduct(_productCount);
        // Set the product name
        _products[_productCount] = Product(_productCount, productName);
        // Return the UPI number
        return _productCount;
    }

    // Get a product name from a UPI number
    function getProduct(uint256 upi) public view returns (Product memory) {
        return _products[upi];
    }
}