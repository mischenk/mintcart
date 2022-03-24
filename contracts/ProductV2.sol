//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Product is ERC1155, ERC1155Holder, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    //===== Mutable state ======
    string public tokenUri;
    address payable seller;
    uint256 public price;
    uint256 public supply;
    uint256 public sold;

    constructor(
        string memory _tokenUri,
        address _seller,
        uint256 _price,
        uint256 _supply
    ) ERC1155(tokenUri) {
        tokenUri = _tokenUri;
        seller = payable(_seller);
        price = _price;
        supply = _supply;
        sold = 0;

        transferOwnership(seller);
    }

    function setTokenUri(string memory _tokenUri) external onlyOwner {
        tokenUri = _tokenUri;
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function setSupply(uint256 _supply) external onlyOwner {
        supply = _supply;
    }

    function buy(uint256 amount) external payable returns (uint256) {
        require(
            msg.sender == tx.origin,
            "No transactions from smart contracts!"
        );
        require(msg.value >= price * amount, "Error, product costs more");
        require(
            amount <= supply - sold,
            "Error, amount is higher than supply left"
        );

        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        sold += amount;

        _mint(msg.sender, newTokenId, amount, "");

        return newTokenId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
