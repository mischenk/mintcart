//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Product.sol";

contract ProductFactory is Ownable {
    //===== Mutable state ======
    using Counters for Counters.Counter;

    Counters.Counter public tokenIds;
    string public baseUri;

    struct ProductItem {
        uint256 tokenId;
        address productContract;
        address payable owner;
        uint256 price;
        uint256 amount;
        uint256 sold;
    }

    mapping(uint256 => ProductItem) private idToProductItem;

    event ProductCreated(
        uint256 indexed tokenId,
        address productContract,
        address owner,
        uint256 price,
        uint256 amount
    );

    constructor(string memory _baseUri) {
        baseUri = _baseUri;
    }

    function createProduct(uint256 price, uint256 amount) external {
        require(price > 0, "Price must be at least 1 wei");
        require(amount > 0, "Amount must be at least 1");

        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        address productAddress = address(new Product(baseUri));

        idToProductItem[newTokenId] = ProductItem(
            newTokenId,
            productAddress,
            payable(msg.sender),
            price,
            amount,
            0
        );

        emit ProductCreated(
            newTokenId,
            productAddress,
            msg.sender,
            price,
            amount
        );
    }

    function fetchProducts() public view returns (ProductItem[] memory) {
        uint256 totalItemCount = tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToProductItem[i].owner == msg.sender) {
                itemCount = itemCount + 1;
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

    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
