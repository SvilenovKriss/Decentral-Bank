import React, { Component } from "react";
import tether from '../tether.png';

class Main extends Component {
    amount = 0;

    constructor(props) {
        super(props)
        this.state = {
            amount: 0
        }
    }

    // async UNSAFE_componentWillMount() {
    //     console.log('WILL MOUNT, ', this.props);
    // }

    async setAmount(value) {
        this.amount = value;
    }

    render() {
        return (
            <div id="content" className="mt-3">
                <table className="table text-muted text-center">
                    <thead>
                        <tr style={{ color: 'black' }}>
                            <th>Staking Balance</th>
                            <th>Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ color: 'black' }}>
                            <td>{this.props.stakingBalance} USDT</td>
                            <td>{this.props.rwdBalance} RWD</td>
                        </tr>
                    </tbody>
                </table>
                <div className="card mb-3" style={{ backgroundColor: 'white', opacity: '.9' }}>
                    <form className="mb-3" onSubmit={this.callStakeTokens}>
                        <div style={{ borderSpace: '0 1em' }}>
                            <label className="float-left ml-3"><b>Stake Tokens</b></label>
                            <label className="float-right mr-3"><b>Balance: {this.props.tetherBalance}</b></label>
                            <div className="input-group mb-4 ml-2">
                                <input
                                    type="number"
                                    placeholder="0"
                                    required
                                    onChange={e => this.setState({ amount: e.target.value })}
                                />
                                <div className="input-group-opened">
                                    <div className="input-group-text">
                                        <img src={tether} alt="tether" height="32" />
                                        &nbsp;&nbsp;&nbsp; USDT
                                    </div>
                                </div>
                            </div>
                            <button type="button" onClick={e => this.props.stakeTokens(e, this.state.amount)} className='btn btn-primary btn-lg btn-block' >DEPOSIT</button>
                        </div>
                    </form>
                    <button type="button" onClick={e => this.props.unstakeTokens()} className='btn btn-primary btn-lg btn-block'>WITDRAW</button>
                </div>
                <div className="card text-center" style={{backgroundColor: ''}}>
                    <p className="text-center" style={{margin: '0 auto'}}>AIRDROP: 0:20</p>
                </div>
            </div>
        );
    }
}

export default Main;