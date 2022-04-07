//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./Product.sol";
import "./ProfitSharingToken.sol";

contract ProductFactory {
    address profitSharingToken;

    address[] allProducts;
    mapping(address => address[]) productsBySeller;
    mapping(address => mapping(string => address)) productsBySlug;

    constructor(address _profitSharingToken) {
        profitSharingToken = _profitSharingToken;
    }

    event ProductCreated(
        uint256 indexed productId,
        address productContract,
        string tokenUri,
        string slug,
        address seller,
        uint256 price,
        uint256 supply
    );

    function create(
        string memory tokenUri,
        string memory slug,
        address payable seller,
        uint256 price,
        uint256 supply
    ) external returns (address) {
        require(supply > 0, "Error, supply must be at least 1");

        Product product = new Product(
            tokenUri,
            seller,
            price,
            supply,
            profitSharingToken
        );

        address addr = address(product);

        allProducts.push(addr);
        productsBySeller[seller].push(addr);
        productsBySlug[seller][slug] = addr;

        emit ProductCreated(
            allProducts.length,
            addr,
            tokenUri,
            slug,
            seller,
            price,
            supply
        );

        return addr;
    }

    function buy(
        address seller,
        string memory slug,
        uint256 amount
    ) external payable returns (uint256) {
        address addr = productsBySlug[seller][slug];
        Product product = Product(addr);

        return product.buy(amount);
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
