// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CourseContract {

    address public owner;

    enum UserStatus { NotEnrolled, Enrolled, Completed }

    struct Course {
        bool exists;
        // 其他课程相关的属性...
    }

    struct Enrollment {
        UserStatus status;
        uint256 deposit;
    }

    mapping(string => Course) public courses;
    mapping(address => mapping(string => Enrollment)) public enrollments;

    uint256 public poolAmount; // 奖池余额

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner!");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // 1. Creator functions

    function createCourse(string memory courseName) public onlyOwner {
        require(!courses[courseName].exists, "Course already exists");
        courses[courseName].exists = true;
    }

    function setUserStatus(address user, string memory courseName, UserStatus status) public onlyOwner {
        require(courses[courseName].exists, "Course does not exist");
        enrollments[user][courseName].status = status;
    }

    

    function withdrawFromPool(uint256 amount) public onlyOwner {
        require(amount <= poolAmount, "Not enough funds in the pool!");
        payable(msg.sender).transfer(amount);
        poolAmount -= amount;
    }

    // 2. User functions

    function enrollAndPayDeposit(string memory courseName) public payable {
        require(courses[courseName].exists, "Course does not exist");
        require(enrollments[msg.sender][courseName].status == UserStatus.NotEnrolled, "User already enrolled or completed the course!");

        enrollments[msg.sender][courseName].deposit = msg.value;
        enrollments[msg.sender][courseName].status = UserStatus.Enrolled;

        poolAmount += msg.value;  // 把保证金放入奖池
    }

    function claimDepositBack(string memory courseName) public {
        require(enrollments[msg.sender][courseName].status == UserStatus.Completed, "User has not completed the course!");
        
        uint256 depositAmount = enrollments[msg.sender][courseName].deposit;
        require(depositAmount <= poolAmount, "Not enough funds in the pool!");
        
        payable(msg.sender).transfer(depositAmount);
        
        poolAmount -= depositAmount;  // 从奖池中减去退还的保证金
        enrollments[msg.sender][courseName].deposit = 0;
    }
}
