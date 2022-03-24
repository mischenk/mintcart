//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./ProductV2.sol";

contract ProductFactory {
    address[] allProducts;
    mapping(address => address[]) productsBySeller;
    mapping(address => mapping(string => address)) productsBySlug;

    constructor() {}

    function create(
        string memory tokenUri,
        string memory slug,
        address payable seller,
        uint256 price,
        uint256 supply
    ) external returns (address) {
        require(supply > 0, "Error, supply must be at least 1");

        Product product = new Product(tokenUri, seller, price, supply);

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
