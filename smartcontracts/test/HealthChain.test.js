const HealthChain = artifacts.require('./HealthChain.sol');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

contract('HealthChain', (accounts) => {
  const [deployer, uploader] = accounts;

  let healthChain;

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
    const patientTestData = {
      fullName: 'Jack Cooper',
      age: new BN(24),
      sex: 'male',
    };

    it('Patient registration', async () => {
      await expectRevert(
        healthChain.registerPatient(
          '',
          patientTestData.age,
          patientTestData.sex,
          {
            from: uploader,
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
            from: uploader,
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
            from: uploader,
          }
        ),
        'Sex should not empty'
      );

      const success = await healthChain.registerPatient.call(
        patientTestData.fullName,
        patientTestData.age,
        patientTestData.sex,
        {
          from: uploader,
        }
      );
      assert.equal(success, true, 'It returns true');

      const receipt = await healthChain.registerPatient(
        patientTestData.fullName,
        patientTestData.age,
        patientTestData.sex,
        {
          from: uploader,
        }
      );
      expectEvent(receipt, 'PatientRegistered', {
        fullName: patientTestData.fullName,
        age: patientTestData.age,
        sex: patientTestData.sex,
      });

      const newlyRegsiteredPatient = await healthChain.getPatientData(uploader);
      assert.equal(newlyRegsiteredPatient.fullName, patientTestData.fullName);
      assert.equal(newlyRegsiteredPatient.age.toNumber(), patientTestData.age);
      assert.equal(newlyRegsiteredPatient.sex, patientTestData.sex);

      await expectRevert(
        healthChain.registerPatient(
          patientTestData.fullName,
          patientTestData.age,
          patientTestData.sex,
          {
            from: uploader,
          }
        ),
        'Registration already exists'
      );
    });

    const doctorTestData = {
      fullName: 'Jack Cooper',
      hospitalName: 'Starcare',
      specialization: 'Cardiologist',
      address: accounts[0],
    };

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
  });
});
