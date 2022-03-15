//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Product is ERC1155, Ownable {
    //===== Mutable state ======
    string public baseUri;

    //===== Constructor ======
    constructor(string memory _baseUri) ERC1155(_baseUri) {
        baseUri = _baseUri;
    }

    function buy(uint256 tokenId, uint256 amount)
        external
        onlyOwner
        returns (uint256)
    {
        _mint(msg.sender, tokenId, amount, "");
        return tokenId;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(baseUri, Strings.toString(tokenId), ".json")
            );
    }
}
