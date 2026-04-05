// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ApolloZKID
 * @author APOLLO Team - HashKey On-Chain Horizon Hackathon 2026
 * @notice Soulbound Token (SBT) representing a "Low Risk ZKID" credential
 * @dev Non-transferable ERC721 - once minted, it stays with the owner forever
 */
contract ApolloZKID is ERC721, Ownable {
    /// @notice Current token ID counter
    uint256 private _tokenIdCounter;

    /// @notice Tracks if an address already has a ZKID
    mapping(address => bool) public hasZKID;

    /// @notice Emitted when a new ZKID is minted
    event ZKIDMinted(address indexed user, uint256 tokenId);
    /// @notice Emitted when a ZKID is revoked
    event ZKIDRevoked(address indexed user, uint256 tokenId);

    constructor() ERC721("Apollo ZKID", "ZKID") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }

    /// @notice Mint a new ZKID SBT to a user
    /// @param to Address to receive the ZKID
    /// @return tokenId The minted token ID
    /// @dev Only owner can mint. Each address can only have one ZKID.
    function mintZKID(address to) external onlyOwner returns (uint256) {
        require(!hasZKID[to], "ApolloZKID: Address already has a ZKID");
        require(to != address(0), "ApolloZKID: Cannot mint to zero address");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        hasZKID[to] = true;

        emit ZKIDMinted(to, tokenId);
        return tokenId;
    }

    /// @notice Check if an address has a valid ZKID
    /// @param user Address to verify
    /// @return True if the address holds a ZKID SBT
    function verifyZKID(address user) external view returns (bool) {
        return hasZKID[user];
    }

    /// @notice Get the token ID owned by an address
    /// @param user Address to query
    /// @return Token ID (0 if none)
    function getTokenId(address user) external view returns (uint256) {
        if (!hasZKID[user]) return 0;

        // Find the token owned by this user
        for (uint256 i = 1; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) == user) {
                return i;
            }
        }
        return 0;
    }

    /// @notice Returns the total number of ZKIDs minted
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    // ============ SOULBOUND OVERRIDES ============

    /// @dev Prevents transfers - makes token Soulbound (only mint/burn allowed)
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);

        // Allow minting (from == address(0)) and burning (to == address(0))
        // But prevent transfers between addresses
        if (from != address(0) && to != address(0)) {
            revert("ApolloZKID: Soulbound tokens cannot be transferred");
        }

        return super._update(to, tokenId, auth);
    }

    /// @dev Blocks approvals since transfers are disabled
    function approve(address, uint256) public pure override {
        revert("ApolloZKID: Soulbound tokens cannot be approved");
    }

    /// @dev Blocks setApprovalForAll since transfers are disabled
    function setApprovalForAll(address, bool) public pure override {
        revert("ApolloZKID: Soulbound tokens cannot be approved");
    }

    /// @notice Returns base64 encoded JSON metadata for the SBT
    /// @param tokenId Token ID to query
    /// @return Base64 encoded JSON metadata URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        return string(abi.encodePacked(
            "data:application/json;base64,",
            _encodeBase64(bytes(string(abi.encodePacked(
                '{"name": "Apollo ZKID #', _toString(tokenId), '",',
                '"description": "Low Risk ZKID - Soulbound Token credential for Apollo DeFi Protocol",',
                '"image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWEyZSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZmY4OCIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHRleHQgeD0iMTAwIiB5PSIxMDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+WktJRDwvdGV4dD48L3N2Zz4=",',
                '"attributes": [{"trait_type": "Risk Level", "value": "Low"}, {"trait_type": "Type", "value": "Soulbound"}]}'
            ))))
        ));
    }

    // Helper function to convert uint to string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Base64 encoding table
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function _encodeBase64(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        bytes memory result = new bytes(encodedLen + 32);

        uint256 i = 0;
        uint256 j = 0;

        for (; i + 3 <= data.length; i += 3) {
            uint256 a = uint8(data[i]);
            uint256 b = uint8(data[i + 1]);
            uint256 c = uint8(data[i + 2]);

            result[j++] = TABLE[a >> 2];
            result[j++] = TABLE[((a & 3) << 4) | (b >> 4)];
            result[j++] = TABLE[((b & 15) << 2) | (c >> 6)];
            result[j++] = TABLE[c & 63];
        }

        if (i + 1 == data.length) {
            uint256 a = uint8(data[i]);
            result[j++] = TABLE[a >> 2];
            result[j++] = TABLE[(a & 3) << 4];
            result[j++] = "=";
            result[j++] = "=";
        } else if (i + 2 == data.length) {
            uint256 a = uint8(data[i]);
            uint256 b = uint8(data[i + 1]);
            result[j++] = TABLE[a >> 2];
            result[j++] = TABLE[((a & 3) << 4) | (b >> 4)];
            result[j++] = TABLE[(b & 15) << 2];
            result[j++] = "=";
        }

        assembly {
            mstore(result, j)
        }

        return string(result);
    }
}
