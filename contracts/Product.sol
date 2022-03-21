//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Product is ERC1155, ERC1155Holder, Ownable {
    using Counters for Counters.Counter;

    //===== Mutable state ======
    Counters.Counter private tokenIds;
    string public name;
    string public baseUri;

    struct ProductItem {
        uint256 tokenId;
        string metadataHash;
        address payable seller;
        string slug;
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
        string slug,
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
        string memory slug,
        uint256 price,
        uint256 amount
    ) external returns (uint256) {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        _mint(msg.sender, newTokenId, amount, "");

        createProductItem(newTokenId, metadataHash, slug, price, amount);

        return newTokenId;
    }

    function createProductItem(
        uint256 tokenId,
        string memory metadataHash,
        string memory slug,
        uint256 price,
        uint256 amount
    ) private {
        require(price > 0, "Price must be at least 1 wei");
        require(amount > 0, "Amount must be at least 1");

        idToProductItem[tokenId] = ProductItem(
            tokenId,
            metadataHash,
            payable(msg.sender),
            slug,
            price,
            amount,
            0
        );

        safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

        emit ProductItemCreated(
            tokenId,
            metadataHash,
            msg.sender,
            slug,
            price,
            amount
        );
    }

    function fetchProducts() public view returns (ProductItem[] memory) {
        uint256 totalItemCount = tokenIds.current();

        ProductItem[] memory items = new ProductItem[](totalItemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            items[i] = idToProductItem[i + 1];
        }

        return items;
    }

    function fetchSellerProducts(address _seller)
        public
        view
        returns (ProductItem[] memory)
    {
        uint256 totalItemCount = tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToProductItem[i].seller == _seller) {
                itemCount++;
            }
        }

        ProductItem[] memory items = new ProductItem[](itemCount);

        for (uint256 i = 1; i <= itemCount; i++) {
            if (idToProductItem[i].seller == _seller) {
                items[currentIndex] = idToProductItem[i];
                currentIndex++;
            }
        }

        return items;
    }

    function fetchProduct(uint256 _tokenId)
        external
        view
        returns (ProductItem memory)
    {
        return idToProductItem[_tokenId];
    }

    function fetchProductBySlug(address _seller, string memory _slug)
        external
        view
        returns (ProductItem memory)
    {
        uint256 totalItemCount = tokenIds.current();

        for (uint256 i = 1; i <= totalItemCount; i++) {
            ProductItem memory item = idToProductItem[i];
            if (item.seller == _seller) {
                return item;
            }
        }

        revert("Error, product not found");
    }

    function buy(uint256 tokenId, uint256 quantity) external payable {
        ProductItem memory p = idToProductItem[tokenId];
        uint256 amountLeft = p.amount - p.sold;

        require(
            p.sold < idToProductItem[tokenId].amount,
            "Product is sold out"
        );
        require(quantity <= amountLeft, "Error, quantity too large");
        require(msg.value >= p.price * quantity, "Error, product costs more");

        idToProductItem[tokenId].sold += quantity;

        _safeTransferFrom(address(this), msg.sender, tokenId, quantity, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return idToProductItem[tokenId].metadataHash;
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
