const HealthToken = artifacts.require('./HealthToken.sol');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

const TOKEN_SUPPLY = 500 * 1000 * 1000;

contract('HealthToken', (accounts) => {
  const [deployer, uploader] = accounts;
  let healthToken;

  before(async () => {
    healthToken = await HealthToken.deployed();
  });

  it('Deploys successfully', async () => {
    const address = await healthToken.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it('Set Token Name, Symbol and Standard', async () => {
    const name = await healthToken.name();
    const symbol = await healthToken.symbol();
    const standard = await healthToken.standard();
    assert.equal(name, 'HealthToken', 'Token has correct name');
    assert.equal(symbol, 'HEAL', 'Token has correct symbol');
    assert.equal(standard, 'HealthToken V1.0', 'Token has correct standard');
  });

  it('Sets the total supply', async () => {
    const totalSupply = await healthToken.totalSupply();
    assert.equal(
      totalSupply.toNumber(),
      TOKEN_SUPPLY,
      'Sets the total supply to 500 Million'
    );
  });

  it('Allocate initial supply', async () => {
    const adminBalance = await healthToken.balanceOf(deployer);
    assert.equal(
      adminBalance.toNumber(),
      TOKEN_SUPPLY,
      'Allocate total supply to admin'
    );
  });

  it('Transfer tokens', async () => {
    await expectRevert(
      healthToken.transfer.call(uploader, 99999999999999),
      'Not Enough Balance'
    );

    const amountToTranfer = new BN(250);
    const success = await healthToken.transfer.call(uploader, amountToTranfer, {
      from: deployer,
    });
    assert.equal(success, true, 'It returns true');

    const initialFromBalance = await healthToken.balanceOf(deployer);
    const initialToBalance = await healthToken.balanceOf(uploader);

    const receipt = await healthToken.transfer(uploader, amountToTranfer, {
      from: deployer,
    });
    expectEvent(receipt, 'Transfer', {
      from: deployer,
      to: uploader,
      value: amountToTranfer,
    });

    const afterFromBalance = await healthToken.balanceOf(deployer);
    const afterToBalance = await healthToken.balanceOf(uploader);
    assert.equal(
      afterToBalance.toNumber() - initialToBalance.toNumber(),
      amountToTranfer,
      'Amount Credited To Address'
    );
    assert.equal(
      initialFromBalance.toNumber() - afterFromBalance.toNumber(),
      amountToTranfer,
      'Amount Debited From Address'
    );
  });

  it('Approve tokens for delegated transfer', async () => {
    await expectRevert(
      healthToken.approve(uploader, 99999999999999),
      'Cannot approve more the current balance'
    );

    const amountToTranfer = new BN(100);
    const success = await healthToken.approve.call(uploader, amountToTranfer);
    assert.equal(success, true, 'It returns true');

    const receipt = await healthToken.approve(accounts[1], amountToTranfer, {
      from: deployer,
    });

    expectEvent(receipt, 'Approval', {
      owner: deployer,
      spender: uploader,
      value: amountToTranfer,
    });

    const allowance = await healthToken.allowance(accounts[0], uploader);
    assert.equal(
      allowance.toNumber(),
      amountToTranfer,
      'Sotes the allowance for delegated transfer'
    );
  });

  it('Handle delegated transfer', async () => {
    const initialFromBalance = new BN(100);
    const amountToApprove = new BN(20);
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];

    await healthToken.transfer(fromAccount, initialFromBalance, {
      from: deployer,
    });
    await healthToken.approve(spendingAccount, amountToApprove, {
      from: fromAccount,
    });

    await expectRevert(
      healthToken.transferFrom(fromAccount, toAccount, 99999, {
        from: spendingAccount,
      }),
      'Not Enough Balance'
    );

    await expectRevert(
      healthToken.transferFrom.call(fromAccount, toAccount, 25, {
        from: spendingAccount,
      }),
      'Not Enough Allowed Balance'
    );

    const amountToTranfer = new BN(10);
    const success = await healthToken.transferFrom.call(
      fromAccount,
      toAccount,
      amountToTranfer,
      {
        from: spendingAccount,
      }
    );
    assert.equal(success, true, 'Approved transaction success');

    const receipt = await healthToken.transferFrom(
      fromAccount,
      toAccount,
      amountToTranfer,
      {
        from: spendingAccount,
      }
    );

    expectEvent(receipt, 'Transfer', {
      from: fromAccount,
      to: toAccount,
      value: amountToTranfer,
    });

    const fromBalance = await healthToken.balanceOf(fromAccount);
    assert.equal(
      fromBalance.toNumber(),
      initialFromBalance - amountToTranfer,
      'Deducts amount From Accounts'
    );
    const toBalance = await healthToken.balanceOf(toAccount);
    assert.equal(
      toBalance.toNumber(),
      amountToTranfer,
      'Deducts amount To Accounts'
    );

    const allowance = await healthToken.allowance(fromAccount, spendingAccount);
    assert.equal(
      allowance.toNumber(),
      amountToApprove - amountToTranfer,
      'Deducts amount from allowance'
    );
  });
});
