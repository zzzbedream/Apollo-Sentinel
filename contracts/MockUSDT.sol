// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @author APOLLO Team - HashKey On-Chain Horizon Hackathon 2026
 * @notice Mock USDT token for testnet with faucet functionality
 * @dev 6 decimals like real USDT. Includes faucet with 1-hour cooldown.
 */
contract MockUSDT is ERC20, Ownable {
    /// @notice Faucet claim amount (1000 USDT)
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**6;

    /// @notice Cooldown period between faucet claims
    uint256 public constant FAUCET_COOLDOWN = 1 hours;

    /// @notice Tracks last faucet claim timestamp per address
    mapping(address => uint256) public lastFaucetClaim;

    /// @notice Emitted when tokens are claimed from faucet
    event FaucetClaimed(address indexed user, uint256 amount);

    constructor() ERC20("Mock USDT", "mUSDT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    /// @notice Returns 6 decimals to match real USDT
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @notice Claim free test tokens from the faucet
    /// @dev Subject to 1-hour cooldown between claims
    function faucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "MockUSDT: Faucet cooldown not expired"
        );

        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /// @notice Check remaining cooldown time for faucet
    /// @param user Address to check
    /// @return Remaining seconds (0 if ready to claim)
    function faucetCooldownRemaining(address user) external view returns (uint256) {
        uint256 nextClaimTime = lastFaucetClaim[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        return nextClaimTime - block.timestamp;
    }

    /// @notice Mint tokens to an address (owner only, for testing)
    /// @param to Recipient address
    /// @param amount Amount to mint (6 decimals)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
