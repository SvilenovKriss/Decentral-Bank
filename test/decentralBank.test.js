const { assert } = require('chai');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should();

contract('DecentralBank', (accounts) => {
    let tether;
    let rwd;
    let decentralBank;

    before(async () => {
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        //RWD transfer to decentral bank address.
        await rwd.transfer(decentralBank.address, web3.utils.toWei('1000000'));
        
        //Tether transfer 100 tokens to account[1]
        // 'from' will basically be the msg.sender.
        await tether.transfer(accounts[1], web3.utils.toWei('100'), { from: accounts[0] });
    });

    describe('Mock Tether token', async () => {
        it('name should equal to Tether', async () => {
            assert.equal(await tether.name(), 'Tether');
        });

        it('account[1] should be 100 tokens.', async () => { 
            assert.equal(await tether.balanceOf(accounts[1]), web3.utils.toWei('100'));
        });
    });

    describe('Mock Tether token', async () => {
        it('name should equal to Tether', async () => {
            assert.equal(await rwd.name(), 'Reward Token');
        });

        it('transfer should be equal to 1million', async () => {
            const totalSupplyRWD = await rwd.balanceOf(decentralBank.address)
            assert.equal(totalSupplyRWD.toString(), web3.utils.toWei('1000000'));
        });
    });
    describe('Yield Farming', async () => {
        it('staking functinality', async () => {
            assert.equal(await tether.balanceOf(accounts[1]), web3.utils.toWei('100'));

            //Test staking
            await tether.approve(decentralBank.address, web3.utils.toWei('100'), { from: accounts[1] });
            await decentralBank.depositTokens(web3.utils.toWei('100'), { from: accounts[1] });

            //Expect account[1] to have 0 tokens.
            result = await tether.balanceOf(accounts[1]);
            assert.equal(result.toString(), web3.utils.toWei('0'), 'Account[1] has left with 0 tokens');

            //Expect Decentral Bank address to have 100 tokens.
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), web3.utils.toWei('100'), 'Decentral bank has 100 tokens now.');

            //Expect isStaking for account[1] to be true.
            result = await decentralBank.isStaked(accounts[1]);
            assert.equal(result, true, 'isStaked to be true');
        });
        it('issue reward functinality', async () => {
            await decentralBank.issueRewards({from: accounts[0]});

            //Expect balance of account[1] to have 1 RWD token.
            resultOfRWD = await rwd.balanceOf(accounts[1]);
            assert.equal(resultOfRWD.toString(), web3.utils.toWei('1'), 'RWD balance of account[1] to be 1.');

            //Expect balance of decentral bank to be 99.
            // resultOfBank = await rwd.balanceOf(decentralBank.address);
            // assert.equal(resultOfBank.toString(), web3.utils.toWei('99', 'ether'), 'RWD balance of decentralBank.address to be 99.');
        });
        it('issue reward functinality', async () => {
            await decentralBank.unstakeTokens({from: accounts[1]});

            //Expect account[1] to have 100 tokens.
            result = await tether.balanceOf(accounts[1]);
            assert.equal(result.toString(), web3.utils.toWei('100'));

            //Expect decentral bank to have 0 tokens.
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), web3.utils.toWei('0'));

            //Expect is staking to be false.
            result = await decentralBank.isStaked(accounts[1]);
            assert.equal(result.toString(), 'false');
        });
    });
});