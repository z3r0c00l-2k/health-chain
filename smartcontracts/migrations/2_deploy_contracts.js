const HealthToken = artifacts.require('HealthToken');
const HealthChain = artifacts.require('HealthChain');

const TOTAL_SUPPLY = 500 * 1000 * 1000;

module.exports = async (deployer) => {
  await deployer.deploy(HealthToken, TOTAL_SUPPLY);
  await deployer.deploy(HealthChain);
};
