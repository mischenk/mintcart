//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Product is ERC1155, ERC1155Holder {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    //===== Mutable state ======
    string public name;
    string public baseUri;
    string public tokenUri;
    address payable seller;
    string public slug;
    uint256 public price;
    uint256 public amount;
    uint256 public sold;

    mapping(uint256 => string) public metadataHashesById;

    constructor(
        string memory _name,
        string memory _baseUri,
        string memory _tokenUri,
        address _seller,
        string memory _slug,
        uint256 _price,
        uint256 _amount
    ) ERC1155(_baseUri) {
        name = _name;
        baseUri = _baseUri;
        tokenUri = _tokenUri;
        seller = payable(_seller);
        slug = _slug;
        price = _price;
        amount = _amount;
        sold = 0;
    }

    function get()
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            address,
            string memory
        )
    {
        return (name, slug, price, amount, sold, seller, tokenUri);
    }

    function mint(uint256 _quantity, string memory metadataHash)
        public
        returns (uint256)
    {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        metadataHashesById[newTokenId] = metadataHash;

        _mint(msg.sender, newTokenId, _quantity, "");

        _safeTransferFrom(msg.sender, address(this), newTokenId, _quantity, "");

        return newTokenId;
    }

    function buy(uint256 tokenId, uint256 quantity) external payable {
        require(msg.value >= price * quantity, "Error, product costs more");

        sold += quantity;

        _safeTransferFrom(address(this), msg.sender, tokenId, quantity, "");
    }

    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(baseUri, metadataHashesById[_tokenId], ".json")
            );
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
