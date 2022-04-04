//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";

contract ProfitSharingToken is ERC20, Ownable, ReentrancyGuard {
    using Address for address payable;
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Current evaluation is 50 ETH
    uint256 private _maxSupply;
    uint256 private _price = 1000000000000000; // 0.001 ETH

    Counters.Counter private _totalHolders;
    mapping(uint256 => address) private _holders;
    mapping(address => uint256) private _profits;

    constructor(uint256 maxSupply, uint256 initialSupply)
        ERC20("Profit Sharing Token", "PST")
    {
        require(initialSupply > 0, "Intial supply must be greater than 0");
        require(
            maxSupply >= initialSupply,
            "Max supply must be >= initial supply"
        );

        _maxSupply = maxSupply;

        _mint(msg.sender, initialSupply);

        addHolder(msg.sender);
    }

    function totalHolders() external view returns (uint256) {
        return _totalHolders.current();
    }

    function addHolder(address holder) private {
        _holders[_totalHolders.current()] = holder;
        _totalHolders.increment();
    }

    function addOwner(address holder) external onlyOwner {
        addHolder(holder);
    }

    function profitBalanceOf(address account)
        public
        view
        virtual
        returns (uint256)
    {
        return _profits[account];
    }

    function updateMaxSupply(uint256 maxSupply) external onlyOwner {
        _maxSupply = maxSupply;
    }

    function updatePrice(uint256 price) external onlyOwner {
        _price = price;
    }

    function invest() external payable {
        require(msg.value >= _price, "Error, you must buy at least 1 token");

        uint256 numTokens = msg.value.div(_price);

        require(
            totalSupply().add(numTokens) <= _maxSupply,
            "Error, insufficient token supply"
        );

        _mint(msg.sender, numTokens);

        addHolder(msg.sender);
    }

    function withdrawProfits() external nonReentrant {
        uint256 profit = _profits[msg.sender];
        _profits[msg.sender] = 0;
        payable(msg.sender).sendValue(profit);
    }

    function shareProfits(uint256 value) internal {
        for (uint256 i = 0; i < _totalHolders.current(); i++) {
            address addr = _holders[i];
            uint256 balance = balanceOf(addr);
            uint256 dividend = value.mul(balance).div(totalSupply());
            _profits[addr] = dividend;
        }
    }

    receive() external payable {
        shareProfits(msg.value);
    }
}
