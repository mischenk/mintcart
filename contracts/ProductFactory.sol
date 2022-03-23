//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./ProductV2.sol";

contract ProductFactory {
    address[] allProducts;
    mapping(address => address[]) productsBySeller;
    mapping(address => mapping(string => address)) productsBySlug;

    constructor() {}

    function create(
        string memory name,
        string memory baseUri,
        string memory slug,
        address payable seller,
        uint256 price,
        uint256 amount
    ) external returns (address) {
        require(amount > 0, "Required to mint at least 1 product");

        Product product = new Product(
            name,
            baseUri,
            seller,
            slug,
            price,
            amount
        );

        address addr = address(product);
        allProducts.push(addr);
        productsBySeller[seller].push(addr);
        productsBySlug[seller][slug] = addr;

        return addr;
    }

    function fetchProducts() public view returns (address[] memory) {
        return allProducts;
    }

    function fetchSellerProducts(address _seller)
        external
        view
        returns (address[] memory)
    {
        return productsBySeller[_seller];
    }

    function fetchProductBySlug(address _seller, string memory _slug)
        external
        view
        returns (address)
    {
        return productsBySlug[_seller][_slug];
    }
}
