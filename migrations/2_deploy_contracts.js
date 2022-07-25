const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

const contracts = [
    Tether,
    RWD,
    DecentralBank,
];

module.exports = async function(deployer, network, accounts) {
    // contracts.forEach( async (contract) => await deployer.deploy(contract));
    
    //Initiliaze Tether token.
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();
    
    //Initialize RWD token.
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();
    
    //Initialize DecentralBank.
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed();
    
    //Transfer to Decentralized bank.
    await rwd.transfer(decentralBank.address, '1000000000000000000000000');

    //Transfer 100 tokens to account[1].
    await tether.transfer(accounts[1], '100000000000000000000');

    //Transfer 100 tokens to account[2].
    await tether.transfer(accounts[1], '100000000000000000000');
};