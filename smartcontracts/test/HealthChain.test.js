const HealthChain = artifacts.require('./HealthChain.sol');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

contract('HealthChain', (accounts) => {
  const [deployer, uploader] = accounts;

  let healthChain;

  const patientTestData = {
    fullName: 'Jack Cooper',
    age: new BN(24),
    sex: 'male',
    address: uploader,
  };

  const doctorTestData = {
    fullName: 'Jack Cooper',
    hospitalName: 'Starcare',
    specialization: 'Cardiologist',
    address: accounts[2],
  };

  before(async () => {
    healthChain = await HealthChain.deployed();
  });

  describe('Deployment', () => {
    it('Deploys successfully', async () => {
      const address = await healthChain.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('Has a name', async () => {
      const name = await healthChain.name();
      const version = await healthChain.version();
      assert.equal(name, 'HealthChain');
      assert.equal(version, '0.1');
    });
  });

  describe('Registration', () => {
    it('Patient registration', async () => {
      await expectRevert(
        healthChain.registerPatient(
          '',
          patientTestData.age,
          patientTestData.sex,
          {
            from: patientTestData.address,
          }
        ),
        'Name should not empty'
      );
      await expectRevert(
        healthChain.registerPatient(
          patientTestData.fullName,
          0,
          patientTestData.sex,
          {
            from: patientTestData.address,
          }
        ),
        'Age should not empty'
      );
      await expectRevert(
        healthChain.registerPatient(
          patientTestData.fullName,
          patientTestData.age,
          '',
          {
            from: patientTestData.address,
          }
        ),
        'Sex should not empty'
      );

      const success = await healthChain.registerPatient.call(
        patientTestData.fullName,
        patientTestData.age,
        patientTestData.sex,
        {
          from: patientTestData.address,
        }
      );
      assert.equal(success, true, 'It returns true');

      const receipt = await healthChain.registerPatient(
        patientTestData.fullName,
        patientTestData.age,
        patientTestData.sex,
        {
          from: patientTestData.address,
        }
      );
      expectEvent(receipt, 'PatientRegistered', {
        fullName: patientTestData.fullName,
        age: patientTestData.age,
        sex: patientTestData.sex,
      });

      const newlyRegsiteredPatient = await healthChain.getPatientData(
        patientTestData.address
      );
      assert.equal(newlyRegsiteredPatient.fullName, patientTestData.fullName);
      assert.equal(newlyRegsiteredPatient.age.toNumber(), patientTestData.age);
      assert.equal(newlyRegsiteredPatient.sex, patientTestData.sex);

      await expectRevert(
        healthChain.registerPatient(
          patientTestData.fullName,
          patientTestData.age,
          patientTestData.sex,
          {
            from: patientTestData.address,
          }
        ),
        'Registration already exists'
      );
    });

    it('Doctor registration', async () => {
      await expectRevert(
        healthChain.registerDoctor(
          '',
          doctorTestData.hospitalName,
          doctorTestData.specialization,
          {
            from: doctorTestData.address,
          }
        ),
        'Name should not empty'
      );
      await expectRevert(
        healthChain.registerDoctor(
          doctorTestData.fullName,
          '',
          doctorTestData.specialization,
          {
            from: doctorTestData.address,
          }
        ),
        'Hospital Name should not empty'
      );
      await expectRevert(
        healthChain.registerDoctor(
          doctorTestData.fullName,
          doctorTestData.hospitalName,
          '',
          {
            from: doctorTestData.address,
          }
        ),
        'Specialization should not empty'
      );

      const success = await healthChain.registerDoctor.call(
        doctorTestData.fullName,
        doctorTestData.hospitalName,
        doctorTestData.specialization,
        {
          from: doctorTestData.address,
        }
      );
      assert.equal(success, true, 'It returns true');

      const receipt = await healthChain.registerDoctor(
        doctorTestData.fullName,
        doctorTestData.hospitalName,
        doctorTestData.specialization,
        {
          from: doctorTestData.address,
        }
      );
      expectEvent(receipt, 'DoctorRegistered', {
        fullName: doctorTestData.fullName,
        hospitalName: doctorTestData.hospitalName,
        specialization: doctorTestData.specialization,
      });

      const newlyRegsiteredDoctor = await healthChain.doctorDataOf(
        doctorTestData.address
      );
      assert.equal(newlyRegsiteredDoctor.fullName, doctorTestData.fullName);
      assert.equal(
        newlyRegsiteredDoctor.hospitalName,
        doctorTestData.hospitalName
      );
      assert.equal(
        newlyRegsiteredDoctor.specialization,
        doctorTestData.specialization
      );

      await expectRevert(
        healthChain.registerDoctor(
          doctorTestData.fullName,
          doctorTestData.hospitalName,
          doctorTestData.specialization,
          {
            from: doctorTestData.address,
          }
        ),
        'Registration already exists'
      );
    });

    it('Get Userdata', async () => {
      await expectRevert(
        healthChain.getUserData({ from: accounts[6] }),
        'User is not registered'
      );

      const registeredDoc = await healthChain.getUserData({
        from: doctorTestData.address,
      });
      assert.equal(registeredDoc.fullName, doctorTestData.fullName);
      assert(registeredDoc.isDoctor);
      assert.equal(registeredDoc.hospitalName, doctorTestData.hospitalName);
      assert.equal(registeredDoc.specialization, doctorTestData.specialization);

      const registeredPat = await healthChain.getUserData({
        from: patientTestData.address,
      });
      assert.equal(registeredPat.fullName, patientTestData.fullName);
      assert.equal(registeredPat.isDoctor, false);
    });
  });

  describe('Health Data', () => {
    it('Request for patient data', async () => {
      await expectRevert(
        healthChain.requestForPatientAccess(patientTestData.address, {
          from: deployer,
        }),
        'You should be a doctor'
      );
      await expectRevert(
        healthChain.requestForPatientAccess(accounts[6], {
          from: doctorTestData.address,
        }),
        'No patient found with this id'
      );

      const success = await healthChain.requestForPatientAccess.call(
        patientTestData.address,
        {
          from: doctorTestData.address,
        }
      );
      assert.equal(success, true, 'It returns true');

      await healthChain.requestForPatientAccess(patientTestData.address, {
        from: doctorTestData.address,
      });
      await expectRevert(
        healthChain.requestForPatientAccess(patientTestData.address, {
          from: doctorTestData.address,
        }),
        'Request already exists'
      );
    });

    it('Checking get doctor requests', async () => {
      await expectRevert(
        healthChain.getDoctorRequests({
          from: deployer,
        }),
        'You are not a patient'
      );

      const receipt = await healthChain.getDoctorRequests({
        from: patientTestData.address,
      });
      assert(receipt.includes(doctorTestData.address), 'Request done');
    });

    it('Acepeting a request', async () => {
      await expectRevert(
        healthChain.reviewDoctorRequest(doctorTestData.address, false, {
          from: deployer,
        }),
        'You are not a patient'
      );
      await expectRevert(
        healthChain.reviewDoctorRequest(accounts[5], false, {
          from: patientTestData.address,
        }),
        'The request does not exists'
      );
      assert(
        await healthChain.reviewDoctorRequest.call(
          doctorTestData.address,
          false,
          {
            from: patientTestData.address,
          }
        ),
        'Successfull reject'
      );
      assert(
        await healthChain.reviewDoctorRequest.call(
          doctorTestData.address,
          true,
          {
            from: patientTestData.address,
          }
        ),
        'Successfull reject'
      );

      await healthChain.reviewDoctorRequest(doctorTestData.address, true, {
        from: patientTestData.address,
      });
    });

    it('Revoke Permission of a doctor', async () => {
      await expectRevert(
        healthChain.revokePermission(doctorTestData.address, {
          from: deployer,
        }),
        'You are not a patient'
      );
      await expectRevert(
        healthChain.revokePermission(deployer, {
          from: patientTestData.address,
        }),
        'The permission does not exists'
      );

      assert(
        await healthChain.revokePermission.call(doctorTestData.address, {
          from: patientTestData.address,
        }),
        'It returns true'
      );
    });

    it('Get Health Data', async () => {
      await expectRevert(
        healthChain.getPatientHealth(patientTestData.address, {
          from: deployer,
        }),
        'You are not allowed to access'
      );

      const data = await healthChain.getPatientHealth(patientTestData.address, {
        from: doctorTestData.address,
      });

      assert.equal(data.fullName, patientTestData.fullName);
      assert.equal(data.age.toNumber(), patientTestData.age);
      assert.equal(data.sex, patientTestData.sex);
    });

    it('Add Prescription Note', async () => {
      const prescription = 'Hello';

      await expectRevert(
        healthChain.addPrescription(patientTestData.address, prescription, {
          from: deployer,
        }),
        'You are not allowed to access'
      );
      await expectRevert(
        healthChain.addPrescription(patientTestData.address, '', {
          from: doctorTestData.address,
        }),
        'Notes Should not empty'
      );

      assert(
        await healthChain.addPrescription(
          patientTestData.address,
          prescription,
          {
            from: doctorTestData.address,
          }
        ),
        'It returns true'
      );

      const data = await healthChain.getPatientHealth(patientTestData.address, {
        from: doctorTestData.address,
      });
      const found = data.prescriptionNotes.find((x) => x.note === prescription);
      assert(found, 'Successfully added prescription');
    });
  });
});
