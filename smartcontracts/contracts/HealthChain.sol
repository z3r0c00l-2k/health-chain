// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HealthChain {
    string public name = "HealthChain";
    string public version = "0.1";

    struct Prescription {
        string note;
        uint256 timestamp;
        address payable createdBy;
    }

    struct Patient {
        address payable patientId;
        string fullName;
        uint256 age;
        string sex;
        uint256 createdDate;
        address[] requestedDoctors;
        address[] allowedDoctors;
        Prescription[] prescriptionNotes;
    }

    struct Doctor {
        address payable doctorId;
        string fullName;
        string hospitalName;
        string specialization;
        uint256 createdDate;
        address[] patients;
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

    modifier onlyPatient() {
        require(
            bytes(patientDataOf[msg.sender].fullName).length > 0,
            "You are not a patient"
        );
        _;
    }
    modifier onlyDoctor() {
        require(
            bytes(doctorDataOf[msg.sender].fullName).length > 0,
            "You should be a doctor"
        );
        _;
    }

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
        newPatient.patientId = payable(msg.sender);
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
            string memory sex,
            string memory status
        )
    {
        Patient memory patientData = patientDataOf[_patientId];
        string memory _status = "none";
        if (
            checkItemInsideAddress(
                patientDataOf[_patientId].requestedDoctors,
                msg.sender
            ) >= 0
        ) {
            _status = "requested";
        } else if (
            checkItemInsideAddress(
                patientDataOf[_patientId].allowedDoctors,
                msg.sender
            ) >= 0
        ) {
            _status = "approved";
        }

        return (
            patientData.fullName,
            patientData.age,
            patientData.sex,
            _status
        );
    }

    function getUserData()
        public
        view
        returns (
            string memory fullName,
            bool isDoctor,
            string memory hospitalName,
            string memory specialization
        )
    {
        Patient memory patientData = patientDataOf[msg.sender];
        Doctor memory doctorData = doctorDataOf[msg.sender];

        if (bytes(patientData.fullName).length > 0) {
            return (patientData.fullName, false, "", "");
        }

        if (bytes(doctorData.fullName).length > 0) {
            return (
                doctorData.fullName,
                true,
                doctorData.hospitalName,
                doctorData.specialization
            );
        }

        return ("", false, "", "");
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
        newDoctor.doctorId = payable(msg.sender);
        newDoctor.fullName = _fullName;
        newDoctor.hospitalName = _hospitalName;
        newDoctor.specialization = _specialization;
        newDoctor.createdDate = block.timestamp;

        emit DoctorRegistered(_fullName, _hospitalName, _specialization);

        return true;
    }

    function requestForPatientAccess(address _patientId)
        public
        onlyDoctor
        returns (bool success)
    {
        require(
            bytes(patientDataOf[_patientId].fullName).length > 0,
            "No patient found with this id"
        );
        require(
            checkItemInsideAddress(
                patientDataOf[_patientId].allowedDoctors,
                msg.sender
            ) < 0,
            "Approval already exists"
        );
        require(
            checkItemInsideAddress(
                patientDataOf[_patientId].requestedDoctors,
                msg.sender
            ) < 0,
            "Request already exists"
        );

        patientDataOf[_patientId].requestedDoctors.push(msg.sender);

        return true;
    }

    function getPatientDataByOwner()
        public
        view
        onlyPatient
        returns (Patient memory patientData)
    {
        Patient memory _patientData = patientDataOf[msg.sender];
        return _patientData;
    }

    function getDoctorDataByOwner()
        public
        view
        onlyDoctor
        returns (Doctor memory doctorData)
    {
        Doctor memory _doctorData = doctorDataOf[msg.sender];
        return _doctorData;
    }

    function reviewDoctorRequest(address _doctorId, bool _isAllowed)
        public
        onlyPatient
        returns (bool success)
    {
        int256 pos = checkItemInsideAddress(
            patientDataOf[msg.sender].requestedDoctors,
            _doctorId
        );
        require(pos >= 0, "The request does not exists");

        if (_isAllowed == true) {
            patientDataOf[msg.sender].allowedDoctors.push(_doctorId);
            doctorDataOf[_doctorId].patients.push(msg.sender);
        }

        // Deleting this request from array
        Patient storage patientData = patientDataOf[msg.sender];
        for (
            uint256 i = uint256(pos);
            i < patientData.requestedDoctors.length - 1;
            i++
        ) {
            patientData.requestedDoctors[i] = patientData.requestedDoctors[
                i + 1
            ];
        }
        patientData.requestedDoctors.pop();

        return true;
    }

    function revokePermission(address _doctorId)
        public
        onlyPatient
        returns (bool success)
    {
        int256 pos = checkItemInsideAddress(
            patientDataOf[msg.sender].allowedDoctors,
            _doctorId
        );
        require(pos >= 0, "The permission does not exists");

        // Deleting this permission from array
        Patient storage _patientData = patientDataOf[msg.sender];
        for (
            uint256 i = uint256(pos);
            i < _patientData.allowedDoctors.length - 1;
            i++
        ) {
            _patientData.allowedDoctors[i] = _patientData.allowedDoctors[i + 1];
        }
        _patientData.allowedDoctors.pop();

        Doctor storage _doctorData = doctorDataOf[_doctorId];
        for (
            uint256 i = uint256(pos);
            i < _doctorData.patients.length - 1;
            i++
        ) {
            _doctorData.patients[i] = _doctorData.patients[i + 1];
        }
        _doctorData.patients.pop();

        return true;
    }

    function getPatientHealth(address _patientId)
        public
        view
        returns (
            string memory fullName,
            uint256 age,
            string memory sex,
            uint256 createdDate,
            Prescription[] memory prescriptionNotes
        )
    {
        require(
            checkItemInsideAddress(
                patientDataOf[_patientId].allowedDoctors,
                msg.sender
            ) >= 0,
            "You are not allowed to access"
        );

        Patient storage patientData = patientDataOf[_patientId];

        return (
            patientData.fullName,
            patientData.age,
            patientData.sex,
            patientData.createdDate,
            patientData.prescriptionNotes
        );
    }

    function addPrescription(address _patientId, string memory _note)
        public
        returns (bool success)
    {
        require(bytes(_note).length > 0, "Notes Should not empty");
        require(
            checkItemInsideAddress(
                patientDataOf[_patientId].allowedDoctors,
                msg.sender
            ) >= 0,
            "You are not allowed to access"
        );
        Prescription memory newPrescription = Prescription(
            _note,
            block.timestamp,
            payable(msg.sender)
        );
        Patient storage patientData = patientDataOf[_patientId];
        patientData.prescriptionNotes.push(newPrescription);

        return true;
    }
}

function checkItemInsideAddress(address[] memory _addressList, address _element)
    pure
    returns (int256 pos)
{
    int256 _pos = -1;

    for (uint256 i = 0; i < _addressList.length; i++) {
        if (_element == _addressList[i]) {
            _pos = int256(i);
            break;
        }
    }

    return _pos;
}
