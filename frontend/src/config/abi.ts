export const wagmiAbi = [
    { "inputs": [], "name": "AlreadyExists", "type": "error" },
    { "inputs": [], "name": "DepositNotEnough", "type": "error" },
    { "inputs": [], "name": "FlagNotActive", "type": "error" },
    { "inputs": [], "name": "FlagNotExists", "type": "error" },
    { "inputs": [], "name": "FlagNotExpire", "type": "error" },
    { "inputs": [], "name": "MaxParticipantsReached", "type": "error" },
    { "inputs": [], "name": "ParticipantAlreadyClaimed", "type": "error" },
    { "inputs": [], "name": "ParticipantAlreadyCompleted", "type": "error" },
    { "inputs": [], "name": "ParticipantAlreadyFinished", "type": "error" },
    { "inputs": [], "name": "ParticipantAlreadyJoined", "type": "error" }, 
    { "inputs": [], "name": "ParticipantNotCompleted", "type": "error" }, 
    { "inputs": [], "name": "ParticipantNotFinished", "type": "error" }, 
    { "inputs": [], "name": "ParticipantNotJoined", "type": "error" }, 
    { "anonymous": false, 
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }, 
            { "indexed": true, "internalType": "address", "name": "participant", "type": "address" }, 
            { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" }
        ], "name": "Claimed", "type": "event" 
    }, 
    { "anonymous": false, 
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }, 
            { "indexed": true, "internalType": "address", "name": "participant", "type": "address" }, 
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ], "name": "Completed", "type": "event" }, 
    { "anonymous": false, 
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }, 
            { "indexed": true, "internalType": "address", "name": "participant", "type": "address" }, 
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
        ], "name": "Joined", "type": "event" }, 
    { "anonymous": false, 
        "inputs": [
            { "indexed": true, "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "creator", "type": "address" }, { "components": [{ "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "address", "name": "creator", "type": "address" }, { "internalType": "uint96", "name": "mode", "type": "uint96" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "expireTime", "type": "uint256" }, { "internalType": "uint256", "name": "depositValue", "type": "uint256" }, { "internalType": "uint256", "name": "maxParticipants", "type": "uint256" }], "indexed": false, "internalType": "struct FlagRecord", "name": "flagRecord", "type": "tuple" }], "name": "Registered", "type": "event" }, { "inputs": [{ "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }], "name": "claimFlag", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }], "name": "completeFlag", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, 
            { "internalType": "uint96", "name": "mode", "type": "uint96" }, 
            { "internalType": "bytes", "name": "data", "type": "bytes" }, 
            { "internalType": "uint256", "name": "startTime", "type": "uint256" }, 
            { "internalType": "uint256", "name": "expireTime", "type": "uint256" }, 
            { "internalType": "uint256", "name": "depositValue", "type": "uint256" }, 
            { "internalType": "uint256", "name": "maxParticipants", "type": "uint256" }
        ], "name": "createFlag", 
        "outputs": [
            { "internalType": "bytes32", "name": "", "type": "bytes32" }
        ], 
        "stateMutability": "payable", "type": "function" }, 
        { 
            "inputs": [
            { "internalType": "bytes32", "name": "", "type": "bytes32" }
        ], 
        "name": "flagClaimNum", 
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ], 
        "stateMutability": "view", "type": "function" 
    }, 
    { "inputs": [
        { "internalType": "bytes32", "name": "", "type": "bytes32" }
        ], 
        "name": "flagCurrentReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "flagParticipants", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "flagParticipantsClaim", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "flagParticipantsNum", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "flagParticipantsSuccess", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "flagRecords", "outputs": [{ "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "address", "name": "creator", "type": "address" }, { "internalType": "uint96", "name": "mode", "type": "uint96" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "expireTime", "type": "uint256" }, { "internalType": "uint256", "name": "depositValue", "type": "uint256" }, { "internalType": "uint256", "name": "maxParticipants", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "flagSuccessNum", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "flagTotalReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }], "name": "getFlag", "outputs": [{ "components": [{ "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "address", "name": "creator", "type": "address" }, { "internalType": "uint96", "name": "mode", "type": "uint96" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "expireTime", "type": "uint256" }, { "internalType": "uint256", "name": "depositValue", "type": "uint256" }, { "internalType": "uint256", "name": "maxParticipants", "type": "uint256" }], "internalType": "struct FlagRecord", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }], "name": "joinFlag", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "flagUid", "type": "bytes32" }, { "internalType": "address", "name": "participant", "type": "address" }], "name": "qualifiedParticipant", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
] as const;