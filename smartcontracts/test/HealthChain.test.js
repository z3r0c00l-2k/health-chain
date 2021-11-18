const HealthChain = artifacts.require('./HealthChain.sol');

contract('HealthChain', ([deployer, uploader]) => {
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
});
