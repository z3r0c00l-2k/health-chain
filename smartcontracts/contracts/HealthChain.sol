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
        // TODO check if permission already exists

        patientDataOf[_patientId].requestedDoctors.push(msg.sender);

        return true;
    }

    function getDoctorRequests()
        public
        view
        onlyPatient
        returns (address[] memory requestedDoctors)
    {
        Patient storage patientData = patientDataOf[msg.sender];

        return patientData.requestedDoctors;
    }

    // TODO: Accept request from Doctor
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

    // TODO: Remove an approved Doctor
    function revokePermission(address _doctorId)
        public
        onlyPatient
        returns (bool success)
    {
        int256 pos = checkItemInsideAddress(
            patientDataOf[msg.sender].allowedDoctors,
            _doctorId
        );
    }

    // TODO: Get patient health data

    // TODO: Add a prescriptionNote to Patient
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
