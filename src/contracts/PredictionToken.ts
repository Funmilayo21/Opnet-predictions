import { OP_20 } from '@btc-vision/btc-runtime/runtime';
import { u256 } from '@btc-vision/btc-runtime/types';
import { Blockchain } from '@btc-vision/btc-runtime/runtime/env';

/**
 * PredictionToken - OP_20 token powering the prediction market ecosystem
 * Features:
 * - Governance voting rights
 * - Staking rewards
 * - Market creation incentives
 * - Fee distribution
 */
@final
export class PredictionToken extends OP_20 {
    // Token configuration
    private static readonly TOKEN_NAME: string = 'Prediction Token';
    private static readonly TOKEN_SYMBOL: string = 'PRED';
    private static readonly TOKEN_DECIMALS: u8 = 8;
    private static readonly TOTAL_SUPPLY: u256 = u256.fromU64(1_000_000_000); // 1 billion tokens

    // Distribution allocations
    private static readonly ECOSYSTEM_ALLOCATION: u256 = u256.fromU64(400_000_000); // 40%
    private static readonly STAKING_REWARDS: u256 = u256.fromU64(300_000_000); // 30%
    private static readonly TEAM_ALLOCATION: u256 = u256.fromU64(150_000_000); // 15%
    private static readonly LIQUIDITY_POOL: u256 = u256.fromU64(150_000_000); // 15%

    constructor() {
        super();
    }

    public override onDeployment(): void {
        // Initialize token with total supply
        const deployer = Blockchain.tx.sender;
        
        // Mint initial supply to deployer for distribution
        this._mint(deployer, PredictionToken.TOTAL_SUPPLY);
    }

    public name(): string {
        return PredictionToken.TOKEN_NAME;
    }

    public symbol(): string {
        return PredictionToken.TOKEN_SYMBOL;
    }

    public decimals(): u8 {
        return PredictionToken.TOKEN_DECIMALS;
    }

    /**
     * Burn tokens to reduce supply
     * Can be used for deflationary mechanics
     */
    public burn(amount: u256): void {
        const sender = Blockchain.tx.sender;
        this._burn(sender, amount);
    }

    /**
     * Check if an address has voting rights (holds tokens)
     */
    public hasVotingRights(address: Address): bool {
        const balance = this.balanceOf(address);
        return balance > u256.Zero;
    }

    /**
     * Get voting power based on token holdings
     */
    public votingPower(address: Address): u256 {
        return this.balanceOf(address);
    }
}
