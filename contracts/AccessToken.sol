// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessToken is ERC1155Supply, Ownable {
    string public name;
    string public baseUri;
    uint256 public tokenId;
    bool public saleIsActive = false;
    uint256 public maxPerTransaction = 1;
    uint256 public maxPerWallet = 1;
    uint256 public maxSupply = 1444;
    uint256 public reservedTokensMinted = 0;

    uint256 public constant NUMBER_RESERVED_TOKENS = 100;
    uint256 public constant PRICE = 250000000000000000; //0.25 ETH

    constructor(string memory _name, string memory _baseUri) ERC1155(_baseUri) {
        name = _name;
        baseUri = _baseUri;
    }

    function mintToken(uint256 _tokenId, uint256 _amount) external payable {
        require(
            msg.sender == tx.origin,
            "No transaction from smart contracts!"
        );
        require(saleIsActive, "Sale must be active to mint");
        require(
            _amount > 0 && _amount <= maxPerTransaction,
            "Max per transaction reached, sale not allowed"
        );
        require(
            balanceOf(msg.sender, _tokenId) + _amount <= maxPerWallet,
            "Limit per wallet reached with this amount, sale not allowed"
        );
        require(
            totalSupply(_tokenId) + _amount <=
                maxSupply - (NUMBER_RESERVED_TOKENS - reservedTokensMinted),
            "Purchase would exceed max supply"
        );
        require(msg.value >= PRICE * _amount, "Not enough ETH for transaction");

        _mint(msg.sender, _tokenId, _amount, "");
    }

    function mintReservedTokens(
        address _to,
        uint256 _tokenId,
        uint256 _amount
    ) external onlyOwner {
        require(
            reservedTokensMinted + _amount <= NUMBER_RESERVED_TOKENS,
            "This amount is more than max allowed"
        );

        _mint(_to, _tokenId, _amount, "");
        reservedTokensMinted = reservedTokensMinted + _amount;
    }

    function flipSaleState() external onlyOwner {
        saleIsActive = !saleIsActive;
    }

    function changeSaleDetails(
        uint256 _maxPerTransaction,
        uint256 _maxPerWallet,
        uint256 _maxSupply
    ) external onlyOwner {
        maxPerTransaction = _maxPerTransaction;
        maxPerWallet = _maxPerWallet;
        maxSupply = _maxSupply;
        saleIsActive = false;
    }
}
