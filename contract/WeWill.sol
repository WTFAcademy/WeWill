// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @notice A struct representing a record for a submitted flag.
struct FlagRecord {
    bytes32 flagUid; // The unique identifier of the flag.
    string title; // flag title
    string description; // flag description
    address creator; // flag creator address
    uint96 mode; // flag verification mode
    bytes data;   // flag data for verification
    uint256 startTime; // flag start time
    uint256 expireTime; // flag expire time. The flag should be completed between startTime and endTime.
    uint256 depositValue; // ethers (in wei) that need to be deposit by each flag participant
    uint256 maxParticipants; // max number of flag participants
}


contract WeWill {
    event Registered(bytes32 indexed flagUid, address indexed creator, FlagRecord flagRecord);
    event Joined(bytes32 indexed flagUid, address indexed participant, uint256 value);
    event Completed(bytes32 indexed flagUid, address indexed participant, uint256 timestamp);
    event Claimed(bytes32 indexed flagUid, address indexed participant, uint256 reward);

    error AlreadyExists();
    error FlagNotExists();
    error FlagNotActive();
    error DepositNotEnough();
    error MaxParticipantsReached();
    error ParticipantAlreadyJoined();
    error ParticipantNotJoined();
    error ParticipantAlreadyFinished();
    error ParticipantNotFinished();
    error ParticipantAlreadyCompleted();
    error ParticipantNotCompleted();
    error FlagNotExpire();
    error ParticipantAlreadyClaimed();

    bytes32 constant EMPTY_UID = 0;
    mapping(bytes32 => FlagRecord) public flagRecords;
    mapping(bytes32 => mapping(address => bool)) public flagParticipants;
    mapping(bytes32 => uint256) public flagParticipantsNum;
    mapping(bytes32 => mapping(address => bool)) public flagParticipantsSuccess;
    mapping(bytes32 => uint256) public flagSuccessNum;
    mapping(bytes32 => uint256) public flagTotalReward;
    mapping(bytes32 => uint256) public flagCurrentReward;
    mapping(bytes32 => mapping(address => bool)) public flagParticipantsClaim;
    mapping(bytes32 => uint256) public flagClaimNum;

    /// Create flag
    function createFlag(string calldata title, string calldata description, uint96 mode, 
        bytes calldata data, uint256 startTime, uint256 expireTime, uint256 depositValue, 
        uint256 maxParticipants) external payable returns (bytes32){

        FlagRecord memory flagRecord = FlagRecord({
            flagUid: EMPTY_UID,
            title: title,
            description: description,
            creator: msg.sender,
            mode: mode,
            data: data,
            startTime: startTime,
            expireTime: expireTime,
            depositValue: depositValue,
            maxParticipants: maxParticipants
         });

        bytes32 flagUid = _getUID(flagRecord);
        if (flagRecords[flagUid].flagUid != EMPTY_UID) {
            revert AlreadyExists();
        }
        flagRecord.flagUid = flagUid;
        flagRecords[flagUid] = flagRecord;
        if(msg.value > 0){
            flagTotalReward[flagUid] += msg.value;
            flagCurrentReward[flagUid] += msg.value;
        }

        emit Registered(flagUid, msg.sender, flagRecord);

        return flagUid;
    }

    /// get a created flag
    function getFlag(bytes32 flagUid) external view returns (FlagRecord memory) {
        return flagRecords[flagUid];
    }

    /// Join flag
    function joinFlag(bytes32 flagUid) external payable {
        FlagRecord memory flagRecord = flagRecords[flagUid];
        uint256 participantsNum = flagParticipantsNum[flagUid];

        if(flagRecord.flagUid != flagUid){
            revert FlagNotExists();
        }
        if(msg.value < flagRecord.depositValue){
            revert DepositNotEnough();
        }
        if(participantsNum >= flagRecord.maxParticipants){
            revert MaxParticipantsReached();
        }
        if(block.timestamp < flagRecord.startTime || block.timestamp > flagRecord.expireTime){
            revert FlagNotActive();
        }
        if(flagParticipants[flagUid][msg.sender] != false){
            revert ParticipantAlreadyJoined();
        }
        if(qualifiedParticipant(flagUid, msg.sender)){
            revert ParticipantAlreadyFinished();
        }

        flagParticipants[flagUid][msg.sender] = true;
        flagParticipantsNum[flagUid] = participantsNum + 1;

        flagTotalReward[flagUid] += msg.value;
        flagCurrentReward[flagUid] += msg.value;

        emit Joined(flagUid, msg.sender, msg.value);
    }

    /// complete flag
    function completeFlag(bytes32 flagUid) public{
        FlagRecord memory flagRecord = flagRecords[flagUid];
        if(flagRecord.flagUid != flagUid){
            revert FlagNotExists();
        }
        if(block.timestamp < flagRecord.startTime || block.timestamp > flagRecord.expireTime){
            revert FlagNotActive();
        }
        if(flagParticipants[flagUid][msg.sender] == false){
            revert ParticipantNotJoined();
        }
        if(flagParticipantsSuccess[flagUid][msg.sender] == true){
            revert ParticipantAlreadyCompleted();
        }
        if(qualifiedParticipant(flagUid, msg.sender) == false){
            revert ParticipantNotFinished();
        }

        flagParticipantsSuccess[flagUid][msg.sender] = true;
        flagSuccessNum[flagUid] += 1;

        emit Completed(flagUid, msg.sender, block.timestamp);
    }

    /// claim rewards from completed flag after it expires
    function claimFlag(bytes32 flagUid) public{
        FlagRecord memory flagRecord = flagRecords[flagUid];
        if(flagRecord.flagUid != flagUid){
            revert FlagNotExists();
        }
        if(block.timestamp < flagRecord.expireTime){
            revert FlagNotExpire();
        }
        if(flagParticipants[flagUid][msg.sender] == false){
            revert ParticipantNotJoined();
        }
        if(flagParticipantsSuccess[flagUid][msg.sender] == false){
            revert ParticipantNotCompleted();
        }
        if(flagParticipantsClaim[flagUid][msg.sender] == true){
            revert ParticipantAlreadyClaimed();
        }
        
        flagParticipantsClaim[flagUid][msg.sender] = true;
        flagClaimNum[flagUid] += 1;

        uint256 ClaimAmount = flagTotalReward[flagUid]/flagSuccessNum[flagUid];
        flagCurrentReward[flagUid] -= ClaimAmount;

        payable(address(this)).transfer(ClaimAmount);
        
        emit Claimed(flagUid, msg.sender, ClaimAmount);
    }

    /// view, Check if a flag is completed by 
    function qualifiedParticipant(bytes32 flagUid, address participant) public view returns (bool){
        FlagRecord memory flagRecord = flagRecords[flagUid];

        if(flagRecord.flagUid != flagUid){
            revert FlagNotExists();
        }
        if(block.timestamp < flagRecord.startTime || block.timestamp > flagRecord.expireTime){
            revert FlagNotActive();
        }
        (address contractAddr, uint256 tokenId) = abi.decode(flagRecord.data, (address, uint256));
        
        if(IERC1155(contractAddr).balanceOf(participant, tokenId) > 0){
            return true;
        }else{
            return false;
        }
    }

    /// @dev Calculates a UID for a given flag.
    /// @param flagRecord The input flag.
    /// @return flag UID.
    function _getUID(FlagRecord memory flagRecord) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(flagRecord.title, flagRecord.description, flagRecord.creator, 
            flagRecord.mode, flagRecord.data, flagRecord.startTime, flagRecord.expireTime, 
            flagRecord.depositValue,flagRecord.maxParticipants));
    }
}

interface IERC1155{
    function balanceOf(address account, uint256 id) external view returns (uint256);
}
