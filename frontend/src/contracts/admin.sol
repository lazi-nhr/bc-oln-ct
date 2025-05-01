// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Interface to interact with the Admin contract
interface IAdmin {
    // User Management
    struct User {
        address account;
        string username;
        uint8 role;
    }
    function setUser(string memory username, uint8 role) external returns (bool);
    function getUser(address account) external view returns (User memory);

    // Product Management
    struct Product {
        uint256 upi;
        string name;
    }
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
        setProduct("Banana");
        setProduct("Apple");
        setProduct("Orange");
        setProduct("Pineapple");
        setProduct("Mango");
        setProduct("Strawberry");
        setProduct("Cherry");
        setProduct("Grape");
        setProduct("Watermelon");
        setProduct("Kiwi");
    }

    // Set a user's username and role
    function setUser(string memory username, uint8 role) public returns (bool) {
        // Check if the user already exists
        require(_users[msg.sender].role == 0, "User already registered");

        // Check if the role is valid
        // 1 = Buyer, 2 = Retailer, 3 = Distributor, 4 = Manufacturer, 5 = Quality Control, 0 = Not registered
        require(role > 0 || role < 6, "Invalid role");

        // Set the user's username and role
        _users[msg.sender] = User(msg.sender, username, role);
        return true;
    }

    // Get a user's username, role and products
    function getUser(address account) public view returns (User memory) {
        return _users[account];
    }

    // Set a product name and assign a unique UPI number
    function setProduct(string memory productName) public returns (uint256) {
        // Increment the product count
        _productCount++;
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