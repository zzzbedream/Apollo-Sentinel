// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice Interface for the ZKID Soulbound Token contract
interface IApolloZKID {
    function verifyZKID(address user) external view returns (bool);
}

/**
 * @title ApolloSentinel
 * @author APOLLO Team - HashKey On-Chain Horizon Hackathon 2026
 * @notice AI-powered DeFi protection layer with JIT rescue and surgical liquidation
 * @dev Manages Rescue Vault liquidity and executes decisions from the AI Oracle
 */
contract ApolloSentinel is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ CONSTANTS ============

    /// @notice Maximum amount per rescue/liquidation operation (1M USDT) - safety limit
    uint256 public constant MAX_RESCUE_AMOUNT = 1_000_000 * 10**6;

    // ============ STATE VARIABLES ============

    /// @notice The USDT token used for liquidity operations
    IERC20 public immutable usdt;

    /// @notice The ZKID SBT contract for verifying low-risk users
    IApolloZKID public immutable zkidContract;

    /// @notice The AI Oracle address - only address authorized to call executeDecision
    address public aiOracle;

    /// @notice Liquidity provider balances in the Rescue Vault
    mapping(address => uint256) public providerBalances;

    /// @notice Total liquidity available in the vault
    uint256 public totalLiquidity;

    /// @notice Total number of JIT rescues executed
    uint256 public totalRescues;
    /// @notice Total number of surgical liquidations executed
    uint256 public totalLiquidations;
    /// @notice Cumulative USDT amount rescued
    uint256 public totalRescueAmount;
    /// @notice Cumulative USDT amount liquidated
    uint256 public totalLiquidationAmount;

    // ============ EVENTS ============

    event LiquidityDeposited(address indexed provider, uint256 amount);
    event LiquidityWithdrawn(address indexed provider, uint256 amount);
    event AIExecuting(address indexed user, bool isRescue, uint256 amount);
    event JIT_RescueExecuted(address indexed user, uint256 amount, uint256 timestamp);
    event SurgicalLiquidation(address indexed user, uint256 amount, uint256 timestamp);
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);

    // ============ ERRORS ============

    error OnlyAIOracle();
    error InsufficientLiquidity();
    error InsufficientBalance();
    error InvalidAmount();
    error AmountExceedsLimit();
    error ZeroAddress();

    // ============ MODIFIERS ============

    modifier onlyAIOracle() {
        if (msg.sender != aiOracle) revert OnlyAIOracle();
        _;
    }

    // ============ CONSTRUCTOR ============

    /// @notice Initializes the ApolloSentinel contract
    /// @param _usdt Address of the USDT token contract
    /// @param _zkidContract Address of the ApolloZKID contract  
    /// @param _aiOracle Address of the AI Oracle backend signer
    constructor(
        address _usdt,
        address _zkidContract,
        address _aiOracle
    ) Ownable(msg.sender) {
        if (_usdt == address(0) || _zkidContract == address(0) || _aiOracle == address(0)) {
            revert ZeroAddress();
        }

        usdt = IERC20(_usdt);
        zkidContract = IApolloZKID(_zkidContract);
        aiOracle = _aiOracle;
    }

    // ============ LIQUIDITY PROVIDER FUNCTIONS ============

    /// @notice Deposit USDT into the Rescue Vault to earn yield
    /// @param amount Amount of USDT to deposit (6 decimals)
    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        usdt.safeTransferFrom(msg.sender, address(this), amount);

        providerBalances[msg.sender] += amount;
        totalLiquidity += amount;

        emit LiquidityDeposited(msg.sender, amount);
    }

    /// @notice Withdraw USDT from the Rescue Vault
    /// @param amount Amount of USDT to withdraw (6 decimals)
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        if (providerBalances[msg.sender] < amount) revert InsufficientBalance();

        providerBalances[msg.sender] -= amount;
        totalLiquidity -= amount;

        usdt.safeTransfer(msg.sender, amount);

        emit LiquidityWithdrawn(msg.sender, amount);
    }

    // ============ AI ORACLE FUNCTIONS ============

    /// @notice Execute a decision from the AI Oracle (JIT rescue or surgical liquidation)
    /// @param user The user address being evaluated
    /// @param isRescue True for rescue attempt, false for direct liquidation
    /// @param amount The USDT amount involved (6 decimals)
    /// @dev Only callable by aiOracle. ZKID holders get rescued; others get liquidated.
    function executeDecision(
        address user,
        bool isRescue,
        uint256 amount
    ) external onlyAIOracle nonReentrant {
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert InvalidAmount();
        if (amount > MAX_RESCUE_AMOUNT) revert AmountExceedsLimit();

        emit AIExecuting(user, isRescue, amount);

        if (isRescue) {
            // Check if user has the ZKID SBT (verified low-risk)
            bool hasZKID = zkidContract.verifyZKID(user);

            if (hasZKID) {
                // User has ZKID - execute JIT rescue
                // Note: In a real implementation, this would interact with lending protocols
                // For demo purposes, we just emit the event and track stats
                if (totalLiquidity < amount) revert InsufficientLiquidity();

                totalRescues++;
                totalRescueAmount += amount;

                emit JIT_RescueExecuted(user, amount, block.timestamp);
            } else {
                // User doesn't have ZKID - proceed with liquidation even if rescue was requested
                totalLiquidations++;
                totalLiquidationAmount += amount;

                emit SurgicalLiquidation(user, amount, block.timestamp);
            }
        } else {
            // Direct liquidation
            totalLiquidations++;
            totalLiquidationAmount += amount;

            emit SurgicalLiquidation(user, amount, block.timestamp);
        }
    }

    // ============ ADMIN FUNCTIONS ============

    /// @notice Update the AI Oracle address (owner only)
    /// @param newOracle New oracle address
    function setAIOracle(address newOracle) external onlyOwner {
        if (newOracle == address(0)) revert ZeroAddress();

        address oldOracle = aiOracle;
        aiOracle = newOracle;

        emit OracleUpdated(oldOracle, newOracle);
    }

    // ============ VIEW FUNCTIONS ============

    /// @notice Get current vault statistics
    /// @return _totalLiquidity Total USDT in vault
    /// @return _totalRescues Number of rescues executed
    /// @return _totalLiquidations Number of liquidations executed
    /// @return _totalRescueAmount Cumulative USDT rescued
    /// @return _totalLiquidationAmount Cumulative USDT liquidated
    function getVaultStats()
        external
        view
        returns (
            uint256 _totalLiquidity,
            uint256 _totalRescues,
            uint256 _totalLiquidations,
            uint256 _totalRescueAmount,
            uint256 _totalLiquidationAmount
        )
    {
        return (
            totalLiquidity,
            totalRescues,
            totalLiquidations,
            totalRescueAmount,
            totalLiquidationAmount
        );
    }

    /// @notice Check if user would be rescued (has valid ZKID)
    /// @param user Address to check
    /// @return True if user has ZKID and qualifies for JIT rescue
    function wouldBeRescued(address user) external view returns (bool) {
        return zkidContract.verifyZKID(user);
    }
}
