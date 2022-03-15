//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Product is ERC1155, Ownable {
    using Counters for Counters.Counter;

    //===== Mutable state ======
    Counters.Counter private tokenIds;
    string public baseUri;

    struct ProductItem {
        uint256 tokenId;
        address payable owner;
        uint256 price;
        uint256 amount;
        uint256 sold;
    }

    mapping(uint256 => ProductItem) private idToProductItem;

    //===== Events ======

    event ProductItemCreated(
        uint256 indexed tokenId,
        address owner,
        uint256 price,
        uint256 amount
    );

    //===== Constructor ======
    constructor(string memory _baseUri) ERC1155(_baseUri) {
        baseUri = _baseUri;
    }

    function createProduct(uint256 price, uint256 amount)
        external
        returns (uint256)
    {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        _mint(msg.sender, newTokenId, amount, "");

        createProductItem(newTokenId, price, amount);

        return newTokenId;
    }

    function createProductItem(
        uint256 tokenId,
        uint256 price,
        uint256 amount
    ) private {
        require(price > 0, "Price must be at least 1 wei");
        require(amount > 0, "Amount must be at least 1");

        idToProductItem[tokenId] = ProductItem(
            tokenId,
            payable(msg.sender),
            price,
            amount,
            0
        );

        emit ProductItemCreated(tokenId, msg.sender, price, amount);
    }

    function fetchProducts() public view returns (ProductItem[] memory) {
        uint256 totalItemCount = tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToProductItem[i].owner == msg.sender) {
                itemCount++;
            }
        }

        ProductItem[] memory items = new ProductItem[](itemCount);

        for (uint256 i = 1; i <= itemCount; i++) {
            if (idToProductItem[i].owner == msg.sender) {
                items[currentIndex] = idToProductItem[i];
                currentIndex++;
            }
        }

        return items;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(baseUri, Strings.toString(tokenId), ".json")
            );
    }
}
