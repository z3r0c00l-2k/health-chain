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
        string fullName;
        uint256 age;
        string sex;
        uint256 createdDate;
        address[] allowedDoctors;
        Prescription[] prescriptionNotes;
    }

    struct Doctor {
        address payable doctorId;
        string fullName;
        string hospitalName;
        string specialization;
        uint256 createdDate;
    }

    mapping(address => Patient) private patientDataOf;
    mapping(address => Doctor) public doctorDataOf;

    event PatientRegistered(string fullName, uint256 age, string sex);
    event DoctorRegistered(
        string fullName,
        string hospitalName,
        string specialization
    );

    constructor() {}

    function registerPatient(
        string memory _fullName,
        uint256 _age,
        string memory _sex
    ) public returns (bool success) {
        require(
            bytes(patientDataOf[msg.sender].fullName).length <= 0,
            "Registration already exists"
        );
        require(bytes(_fullName).length > 0, "Name should not empty");
        require(_age > 0, "Age should not empty");
        require(bytes(_sex).length > 0, "Sex should not empty");

        Patient storage newPatient = patientDataOf[msg.sender];
        newPatient.fullName = _fullName;
        newPatient.age = _age;
        newPatient.sex = _sex;
        newPatient.createdDate = block.timestamp;

        emit PatientRegistered(_fullName, _age, _sex);
        return true;
    }

    function getPatientData(address _patientId)
        public
        view
        returns (
            string memory fullName,
            uint256 age,
            string memory sex
        )
    {
        Patient memory patientData = patientDataOf[_patientId];

        return (patientData.fullName, patientData.age, patientData.sex);
    }

    function registerDoctor(
        string memory _fullName,
        string memory _hospitalName,
        string memory _specialization
    ) public returns (bool success) {
        require(
            bytes(doctorDataOf[msg.sender].fullName).length <= 0,
            "Registration already exists"
        );
        require(bytes(_fullName).length > 0, "Name should not empty");
        require(
            bytes(_hospitalName).length > 0,
            "Hospital Name should not empty"
        );
        require(
            bytes(_specialization).length > 0,
            "Specialization should not empty"
        );

        Doctor storage newDoctor = doctorDataOf[msg.sender];
        newDoctor.fullName = _fullName;
        newDoctor.hospitalName = _hospitalName;
        newDoctor.specialization = _specialization;
        newDoctor.createdDate = block.timestamp;

        emit DoctorRegistered(_fullName, _hospitalName, _specialization);

        return true;
    }
}
