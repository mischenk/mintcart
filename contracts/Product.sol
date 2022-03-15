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
    string public name;
    string public baseUri;

    struct ProductItem {
        uint256 tokenId;
        string metadataHash;
        address payable seller;
        uint256 price;
        uint256 amount;
        uint256 sold;
    }

    mapping(uint256 => ProductItem) private idToProductItem;

    //===== Events ======

    event ProductItemCreated(
        uint256 indexed tokenId,
        string metadataHash,
        address seller,
        uint256 price,
        uint256 amount
    );

    //===== Constructor ======
    constructor(string memory _name, string memory _baseUri) ERC1155(_baseUri) {
        name = _name;
        baseUri = _baseUri;
    }

    function createProduct(
        string memory metadataHash,
        uint256 price,
        uint256 amount
    ) external returns (uint256) {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        _mint(msg.sender, newTokenId, amount, "");

        createProductItem(newTokenId, metadataHash, price, amount);

        return newTokenId;
    }

    function createProductItem(
        uint256 tokenId,
        string memory metadataHash,
        uint256 price,
        uint256 amount
    ) private {
        require(price > 0, "Price must be at least 1 wei");
        require(amount > 0, "Amount must be at least 1");

        idToProductItem[tokenId] = ProductItem(
            tokenId,
            metadataHash,
            payable(msg.sender),
            price,
            amount,
            0
        );

        emit ProductItemCreated(
            tokenId,
            metadataHash,
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
            if (idToProductItem[i].seller == msg.sender) {
                itemCount++;
            }
        }

        ProductItem[] memory items = new ProductItem[](itemCount);

        for (uint256 i = 1; i <= itemCount; i++) {
            if (idToProductItem[i].seller == msg.sender) {
                items[currentIndex] = idToProductItem[i];
                currentIndex++;
            }
        }

        return items;
    }

    function buy(uint256 tokenId, uint256 amount) external payable {
        require(
            idToProductItem[tokenId].sold < idToProductItem[tokenId].amount,
            "Product is sold out"
        );
        idToProductItem[tokenId].sold += 1;

        safeTransferFrom(address(this), msg.sender, tokenId, amount, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return idToProductItem[tokenId].metadataHash;
    }
}
