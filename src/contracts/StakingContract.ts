import { BytesWriter, Blockchain, Address } from '@btc-vision/btc-runtime/runtime';
import { u256 } from '@btc-vision/btc-runtime/types';
import { OP_NET } from '@btc-vision/btc-runtime/runtime/contracts/OP_NET';

/**
 * StakingContract - Allows users to stake PRED tokens and earn rewards
 * Features:
 * - Flexible staking periods
 * - Reward distribution
 * - Early withdrawal penalties
 * - Governance weight calculation
 */
@final
export class StakingContract extends OP_NET {
    // Token contract address
    private tokenContract: Address = Address.dead();
    
    // Staking parameters
    private readonly MIN_STAKE_AMOUNT: u256 = u256.fromU64(1000); // Minimum 1000 tokens
    private readonly REWARD_RATE_PER_BLOCK: u256 = u256.fromU64(100); // Rewards per block
    private readonly EARLY_WITHDRAWAL_PENALTY_BPS: u16 = 1000; // 10% penalty
    
    // Lock periods (in blocks)
    private readonly SHORT_LOCK_PERIOD: u256 = u256.fromU64(144); // ~1 day
    private readonly MEDIUM_LOCK_PERIOD: u256 = u256.fromU64(1008); // ~1 week
    private readonly LONG_LOCK_PERIOD: u256 = u256.fromU64(4320); // ~1 month
    
    // Total staked amount
    private totalStaked: u256 = u256.Zero;

    constructor() {
        super();
    }

    /**
     * Initialize the staking contract with token address
     */
    public initialize(tokenAddress: Address): void {
        if (this.tokenContract != Address.dead()) {
            throw new Error('Already initialized');
        }
        this.tokenContract = tokenAddress;
    }

    /**
     * Stake tokens for a specified lock period
     * @param amount - Amount of tokens to stake
     * @param lockPeriod - Lock period in blocks
     */
    public stake(amount: u256, lockPeriod: u256): void {
        const staker = Blockchain.tx.sender;
        const currentBlock = u256.fromU64(Blockchain.block.number);
        
        // Validate amount
        if (amount < this.MIN_STAKE_AMOUNT) {
            throw new Error('Amount below minimum stake');
        }
        
        // Validate lock period
        if (lockPeriod < this.SHORT_LOCK_PERIOD) {
            throw new Error('Lock period too short');
        }
        
        // Get current stake
        const currentStake = this.getUserStake(staker);
        const newStake = u256.add(currentStake, amount);
        
        // Calculate unlock block
        const unlockBlock = u256.add(currentBlock, lockPeriod);
        
        // Update user stake
        this.setUserStake(staker, newStake);
        this.setUserUnlockBlock(staker, unlockBlock);
        this.setUserLastRewardBlock(staker, currentBlock);
        
        // Update total staked
        this.totalStaked = u256.add(this.totalStaked, amount);
        
        // Transfer tokens to contract (would need token contract interaction)
        // In a real implementation, this would call the token contract's transferFrom
    }

    /**
     * Withdraw staked tokens
     * @param amount - Amount to withdraw
     */
    public withdraw(amount: u256): void {
        const staker = Blockchain.tx.sender;
        const currentBlock = u256.fromU64(Blockchain.block.number);
        
        // Get user stake
        const stakedAmount = this.getUserStake(staker);
        if (stakedAmount < amount) {
            throw new Error('Insufficient staked amount');
        }
        
        // Check if lock period has passed
        const unlockBlock = this.getUserUnlockBlock(staker);
        const isEarlyWithdrawal = currentBlock < unlockBlock;
        
        let withdrawAmount = amount;
        
        // Apply penalty for early withdrawal
        if (isEarlyWithdrawal) {
            const penalty = u256.div(
                u256.mul(amount, u256.fromU32(this.EARLY_WITHDRAWAL_PENALTY_BPS)),
                u256.fromU64(10000)
            );
            withdrawAmount = u256.sub(amount, penalty);
        }
        
        // Claim pending rewards first
        this.claimRewards();
        
        // Update user stake
        const newStake = u256.sub(stakedAmount, amount);
        this.setUserStake(staker, newStake);
        
        // Update total staked
        this.totalStaked = u256.sub(this.totalStaked, amount);
        
        // Transfer tokens back to user
        // In a real implementation, this would call the token contract's transfer
    }

    /**
     * Claim accumulated staking rewards
     */
    public claimRewards(): u256 {
        const staker = Blockchain.tx.sender;
        const currentBlock = u256.fromU64(Blockchain.block.number);
        
        // Calculate pending rewards
        const rewards = this.calculatePendingRewards(staker, currentBlock);
        
        if (rewards > u256.Zero) {
            // Update last reward block
            this.setUserLastRewardBlock(staker, currentBlock);
            
            // Transfer rewards to user
            // In a real implementation, this would mint or transfer reward tokens
        }
        
        return rewards;
    }

    /**
     * Calculate pending rewards for a user
     */
    public calculatePendingRewards(staker: Address, currentBlock: u256): u256 {
        const stakedAmount = this.getUserStake(staker);
        if (stakedAmount == u256.Zero) {
            return u256.Zero;
        }
        
        const lastRewardBlock = this.getUserLastRewardBlock(staker);
        const blocksSinceLastReward = u256.sub(currentBlock, lastRewardBlock);
        
        // Calculate rewards: (stakedAmount * blocksSinceLastReward * rewardRate) / totalStaked
        const totalRewards = u256.mul(
            u256.mul(stakedAmount, blocksSinceLastReward),
            this.REWARD_RATE_PER_BLOCK
        );
        
        if (this.totalStaked > u256.Zero) {
            return u256.div(totalRewards, this.totalStaked);
        }
        
        return u256.Zero;
    }

    /**
     * Get governance voting weight based on staked tokens and lock period
     */
    public getVotingWeight(staker: Address): u256 {
        const stakedAmount = this.getUserStake(staker);
        const currentBlock = u256.fromU64(Blockchain.block.number);
        const unlockBlock = this.getUserUnlockBlock(staker);
        
        if (currentBlock >= unlockBlock) {
            // No lock bonus if already unlocked
            return stakedAmount;
        }
        
        const remainingLockBlocks = u256.sub(unlockBlock, currentBlock);
        
        // Calculate lock bonus multiplier (1x to 2x based on remaining lock time)
        let multiplier = u256.fromU64(10000); // 1x base
        
        if (remainingLockBlocks >= this.LONG_LOCK_PERIOD) {
            multiplier = u256.fromU64(20000); // 2x for long lock
        } else if (remainingLockBlocks >= this.MEDIUM_LOCK_PERIOD) {
            multiplier = u256.fromU64(15000); // 1.5x for medium lock
        } else if (remainingLockBlocks >= this.SHORT_LOCK_PERIOD) {
            multiplier = u256.fromU64(12500); // 1.25x for short lock
        }
        
        return u256.div(u256.mul(stakedAmount, multiplier), u256.fromU64(10000));
    }

    /**
     * Get total staked amount across all users
     */
    public getTotalStaked(): u256 {
        return this.totalStaked;
    }

    /**
     * Get user's staked amount
     */
    public getUserStakedAmount(staker: Address): u256 {
        return this.getUserStake(staker);
    }

    /**
     * Get user's unlock block
     */
    public getUserUnlock(staker: Address): u256 {
        return this.getUserUnlockBlock(staker);
    }

    // Storage helper methods
    private setUserStake(user: Address, amount: u256): void {
        const pointer = this.getUserPointer(user, 'stake');
        this._setU256(pointer, amount);
    }

    private getUserStake(user: Address): u256 {
        const pointer = this.getUserPointer(user, 'stake');
        return this._getU256(pointer);
    }

    private setUserUnlockBlock(user: Address, block: u256): void {
        const pointer = this.getUserPointer(user, 'unlock');
        this._setU256(pointer, block);
    }

    private getUserUnlockBlock(user: Address): u256 {
        const pointer = this.getUserPointer(user, 'unlock');
        return this._getU256(pointer);
    }

    private setUserLastRewardBlock(user: Address, block: u256): void {
        const pointer = this.getUserPointer(user, 'lastReward');
        this._setU256(pointer, block);
    }

    private getUserLastRewardBlock(user: Address): u256 {
        const pointer = this.getUserPointer(user, 'lastReward');
        return this._getU256(pointer);
    }

    private getUserPointer(user: Address, field: string): u256 {
        const writer = new BytesWriter(64);
        writer.writeStringWithLength('staking');
        writer.writeAddress(user);
        writer.writeStringWithLength(field);
        return writer.getHash256();
    }

    private _setU256(pointer: u256, value: u256): void {
        Blockchain.setStorageAt(pointer, value);
    }

    private _getU256(pointer: u256): u256 {
        return Blockchain.getStorageAt(pointer);
    }
}
