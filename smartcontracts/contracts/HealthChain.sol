// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HealthChain {
    string public name = "HealthChain";
    string public version = "0.1";

    struct Prescription {
        string notes;
        uint256 timestamp;
        address payable createdBy;
    }

    struct Patient {
        address payable patientId;
        string name;
        uint256 age;
        string sex;
        uint256 createdDate;
        address payable[] allowedDoctors;
        Prescription[] prescriptionNotes;
    }

    struct Doctor {
        address payable doctorId;
        string name;
        string hospitalName;
    }

    Patient[] private patientsList;
    Doctor[] private doctorList;

    constructor() {}
}
