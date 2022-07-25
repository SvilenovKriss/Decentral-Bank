pragma solidity ^0.5.0;

contract RWD {
    string public name = 'Reward Token';
    string public symbol = 'RWD';
    // Setting total supply to 1 million with 18 zero.
    uint256 public totalSupply = 1000000000000000000000000;
    uint256 public decimals = 18;

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _amount
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );  

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function approve(address _spender, uint256 _amount) public {
        emit Approval(msg.sender, _spender, _amount);
    }

    function transfer(address _to, uint _amount) public returns (bool success) {
        require(balanceOf[msg.sender] >= _amount, "Sender doesn't have enough tokens!");

        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
  
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns(bool success) {
        require(balanceOf[_from] >= _amount);
        require(allowance[msg.sender][_from] >= _amount);

        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        allowance[msg.sender][_from] -= _amount;

        emit Transfer(_from, _to, _amount);

        return true;
    }
}