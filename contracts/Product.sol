//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ProfitSharingToken.sol";

contract Product is ERC1155, ERC1155Holder, Ownable {
    using Address for address payable;
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private tokenIds;

    //===== Mutable state ======
    string tokenUri;
    address seller;
    uint256 price;
    uint256 supply;
    uint256 sold;
    uint256 fee;
    address profitSharingToken;

    constructor(
        string memory _tokenUri,
        address _seller,
        uint256 _price,
        uint256 _supply,
        address _profitSharingToken
    ) ERC1155(tokenUri) {
        tokenUri = _tokenUri;
        seller = payable(_seller);
        price = _price;
        supply = _supply;
        sold = 0;
        fee = price.mul(5).div(100); // 5% fee
        profitSharingToken = _profitSharingToken;

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

    function get()
        external
        view
        returns (
            string memory,
            address,
            uint256,
            uint256,
            uint256
        )
    {
        return (tokenUri, seller, price, supply, sold);
    }

    function buy(uint256 amount) external payable returns (uint256) {
        require(
            msg.sender == tx.origin,
            "No transactions from smart contracts!"
        );
        require(msg.value >= price.mul(amount), "Error, product costs more");
        require(
            amount <= supply.sub(sold),
            "Error, amount is higher than available supply"
        );

        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        sold = sold.add(amount);

        _mint(msg.sender, newTokenId, amount, "");

        payable(profitSharingToken).sendValue(fee);

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
