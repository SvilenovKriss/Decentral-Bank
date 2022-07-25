import React, { Component } from "react";
import Web3 from 'web3';

import '../styles/App.css';

import Navbar from "./Navbar";
import Main from "./Main";
import ParticleSettings from "./ParticleSettins";

import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';

class App extends Component {
    header = 'Hello World!'

    constructor(props) {
        super(props);

        this.state = {
            amount: 0,
            account: '',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: 0,
            rwdBalance: 0,
            stakingBalance: 0,
            loading: true,
        };
    }

    async convertFromWei(value) {
        return window.web3.utils.fromWei(value);
    }

    async UNSAFE_componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.ethereum.currentProvider)
        } else {
            window.alert('No Wallet! Check MetaMask');
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const account = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();

        if (!account.length) {
            alert('Cannot find account!');
        }

        if (!networkId) {
            alert('Cannot find network!');
        }

        const tetherDataAbi = Tether.networks[networkId];
        const rwdDataAbi = RWD.networks[networkId];
        const decentralBankDataAbi = DecentralBank.networks[networkId];

        if (tetherDataAbi && rwdDataAbi && decentralBankDataAbi) {
            const tether = new web3.eth.Contract(Tether.abi, tetherDataAbi.address);
            const rwd = new web3.eth.Contract(RWD.abi, rwdDataAbi.address);
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankDataAbi.address);

            const tetherBalance = await this.convertFromWei((await tether.methods.balanceOf(account[0]).call()));
            const rwdBalance = (await rwd.methods.balanceOf(account[0]).call())
            // const decentralBankBalance = (await rwd.methods.balanceOf(decentralBankDataAbi.address).call());
            const stakingBalance = await this.convertFromWei((await decentralBank.methods.stakingBalance(account[0]).call()));

            this.setState({ account: account[0], tether, tetherBalance, rwd, rwdBalance, decentralBank, stakingBalance });
        } else {
            alert('Error! Tether contract not deployed - not detected!');
        }

        this.setState({ loading: false });
    }

    stakeTokens = async (event, amount) => {
        event.preventDefault();

        const decentralBank = this.state.decentralBank;

        const amountToWei = window.web3.utils.toWei(amount);

        this.setState({ loading: true });
        this.state.tether.methods.approve(this.state.decentralBank._address, amountToWei).send({ from: this.state.account }).on('transactionHash', async (hash) => {
            decentralBank.methods.depositTokens(amountToWei).send({ from: this.state.account }).on('transactionHash', async (hash) => {
                await this.loadBlockchainData();
                this.setState({ loading: false });
            });
        });
    }

    unstakeTokens = async () => {
        this.setState({ loading: true });
        this.state.decentralBank.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', async (hash) => {
            await this.loadBlockchainData();
            this.setState({ loading: false });
        });
    }

    render() {
        console.log('RENDER');
        const content = this.state.loading
            ? <p id='loading' className="text-center">LAODING PLEASE WAIT...</p>
            : <Main
                tetherBalance={this.state.tetherBalance}
                rwdBalance={this.state.rwdBalance}
                stakingBalance={this.state.stakingBalance}
                stakeTokens={this.stakeTokens}
                unstakeTokens={this.unstakeTokens}
            />
        return (
            <div className="app">
                <p className="text-center" style={{ backgroundColor: 'grey', margin: 0 }}> {this.header} </p>
                <Navbar address={this.state.account}/>
                <div className="row">
                    <main role='main' className='col-lg-12 ml-auto mr-auto' style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div>
                            {content}
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default App;