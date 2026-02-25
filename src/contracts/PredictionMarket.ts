import { BytesWriter, Blockchain, Address, Selector } from '@btc-vision/btc-runtime/runtime';
import { u256 } from '@btc-vision/btc-runtime/types';
import { OP_NET } from '@btc-vision/btc-runtime/runtime/contracts/OP_NET';

/**
 * Market status enum
 */
enum MarketStatus {
    PENDING = 0,
    ACTIVE = 1,
    RESOLVED = 2,
    CANCELLED = 3
}

/**
 * Market outcome
 */
enum Outcome {
    NONE = 0,
    YES = 1,
    NO = 2
}

/**
 * PredictionMarket - Core contract for decentralized prediction markets on Bitcoin L1
 * Enables trustless betting on future events with automated resolution
 */
@final
export class PredictionMarket extends OP_NET {
    // Storage pointers
    private marketCounter: u256 = u256.Zero;
    
    // Market creation fee (in satoshis)
    private readonly MARKET_CREATION_FEE: u256 = u256.fromU64(100000); // 0.001 BTC
    
    // Protocol fee percentage (basis points, 100 = 1%)
    private readonly PROTOCOL_FEE_BPS: u16 = 200; // 2%
    
    // Minimum bet amount
    private readonly MIN_BET: u256 = u256.fromU64(10000); // 0.0001 BTC

    constructor() {
        super();
    }

    /**
     * Create a new prediction market
     * @param question - The question/event to predict
     * @param description - Detailed description
     * @param endTime - Timestamp when betting closes
     * @param resolutionTime - Timestamp when market can be resolved
     * @param resolver - Address authorized to resolve the market
     */
    public createMarket(
        question: string,
        description: string,
        endTime: u256,
        resolutionTime: u256,
        resolver: Address
    ): u256 {
        const creator = Blockchain.tx.sender;
        const currentTime = u256.fromU64(Blockchain.block.timestamp);
        
        // Validate parameters
        if (endTime <= currentTime) {
            throw new Error('End time must be in the future');
        }
        
        if (resolutionTime <= endTime) {
            throw new Error('Resolution time must be after end time');
        }
        
        // Increment market counter
        this.marketCounter = u256.add(this.marketCounter, u256.One);
        const marketId = this.marketCounter;
        
        // Store market data
        this.setMarketCreator(marketId, creator);
        this.setMarketQuestion(marketId, question);
        this.setMarketDescription(marketId, description);
        this.setMarketEndTime(marketId, endTime);
        this.setMarketResolutionTime(marketId, resolutionTime);
        this.setMarketResolver(marketId, resolver);
        this.setMarketStatus(marketId, MarketStatus.ACTIVE);
        this.setMarketOutcome(marketId, Outcome.NONE);
        
        // Initialize pools
        this.setMarketYesPool(marketId, u256.Zero);
        this.setMarketNoPool(marketId, u256.Zero);
        this.setMarketTotalPool(marketId, u256.Zero);
        
        return marketId;
    }

    /**
     * Place a bet on a market
     * @param marketId - The market to bet on
     * @param betOnYes - True for YES, false for NO
     * @param amount - Amount to bet (in satoshis)
     */
    public placeBet(marketId: u256, betOnYes: bool, amount: u256): void {
        const bettor = Blockchain.tx.sender;
        const currentTime = u256.fromU64(Blockchain.block.timestamp);
        
        // Validate market exists and is active
        const status = this.getMarketStatus(marketId);
        if (status != MarketStatus.ACTIVE) {
            throw new Error('Market is not active');
        }
        
        // Check if betting is still open
        const endTime = this.getMarketEndTime(marketId);
        if (currentTime >= endTime) {
            throw new Error('Betting period has ended');
        }
        
        // Validate bet amount
        if (amount < this.MIN_BET) {
            throw new Error('Bet amount too low');
        }
        
        // Update pools
        if (betOnYes) {
            const yesPool = this.getMarketYesPool(marketId);
            this.setMarketYesPool(marketId, u256.add(yesPool, amount));
        } else {
            const noPool = this.getMarketNoPool(marketId);
            this.setMarketNoPool(marketId, u256.add(noPool, amount));
        }
        
        const totalPool = this.getMarketTotalPool(marketId);
        this.setMarketTotalPool(marketId, u256.add(totalPool, amount));
        
        // Store user bet
        this.setUserBet(marketId, bettor, betOnYes, amount);
    }

    /**
     * Resolve a market with the final outcome
     * @param marketId - The market to resolve
     * @param outcome - The final outcome (YES or NO)
     */
    public resolveMarket(marketId: u256, outcome: u8): void {
        const resolver = Blockchain.tx.sender;
        const currentTime = u256.fromU64(Blockchain.block.timestamp);
        
        // Validate market exists and is active
        const status = this.getMarketStatus(marketId);
        if (status != MarketStatus.ACTIVE) {
            throw new Error('Market is not active');
        }
        
        // Check if resolver is authorized
        const authorizedResolver = this.getMarketResolver(marketId);
        if (resolver != authorizedResolver) {
            throw new Error('Unauthorized resolver');
        }
        
        // Check if resolution time has passed
        const resolutionTime = this.getMarketResolutionTime(marketId);
        if (currentTime < resolutionTime) {
            throw new Error('Resolution time not reached');
        }
        
        // Validate outcome
        if (outcome != Outcome.YES && outcome != Outcome.NO) {
            throw new Error('Invalid outcome');
        }
        
        // Update market status and outcome
        this.setMarketStatus(marketId, MarketStatus.RESOLVED);
        this.setMarketOutcome(marketId, outcome);
    }

    /**
     * Claim winnings from a resolved market
     * @param marketId - The market to claim from
     */
    public claimWinnings(marketId: u256): u256 {
        const claimer = Blockchain.tx.sender;
        
        // Validate market is resolved
        const status = this.getMarketStatus(marketId);
        if (status != MarketStatus.RESOLVED) {
            throw new Error('Market not resolved');
        }
        
        // Get user bet
        const betAmount = this.getUserBetAmount(marketId, claimer);
        if (betAmount == u256.Zero) {
            throw new Error('No bet found');
        }
        
        // Check if already claimed
        if (this.hasUserClaimed(marketId, claimer)) {
            throw new Error('Already claimed');
        }
        
        // Calculate winnings
        const betOnYes = this.getUserBetSide(marketId, claimer);
        const outcome = this.getMarketOutcome(marketId);
        
        let winnings = u256.Zero;
        
        if ((betOnYes && outcome == Outcome.YES) || (!betOnYes && outcome == Outcome.NO)) {
            // User won
            const totalPool = this.getMarketTotalPool(marketId);
            const winningPool = betOnYes ? this.getMarketYesPool(marketId) : this.getMarketNoPool(marketId);
            
            // Calculate proportional winnings
            // winnings = (betAmount / winningPool) * totalPool
            const proportionalShare = u256.div(u256.mul(betAmount, totalPool), winningPool);
            
            // Deduct protocol fee
            const fee = u256.div(u256.mul(proportionalShare, u256.fromU32(this.PROTOCOL_FEE_BPS)), u256.fromU64(10000));
            winnings = u256.sub(proportionalShare, fee);
        }
        
        // Mark as claimed
        this.setUserClaimed(marketId, claimer, true);
        
        return winnings;
    }

    /**
     * Cancel a market (only by creator before end time)
     * @param marketId - The market to cancel
     */
    public cancelMarket(marketId: u256): void {
        const sender = Blockchain.tx.sender;
        const currentTime = u256.fromU64(Blockchain.block.timestamp);
        
        // Check if sender is market creator
        const creator = this.getMarketCreator(marketId);
        if (sender != creator) {
            throw new Error('Only creator can cancel');
        }
        
        // Check if market is still active
        const status = this.getMarketStatus(marketId);
        if (status != MarketStatus.ACTIVE) {
            throw new Error('Market is not active');
        }
        
        // Check if before end time
        const endTime = this.getMarketEndTime(marketId);
        if (currentTime >= endTime) {
            throw new Error('Cannot cancel after end time');
        }
        
        // Update status
        this.setMarketStatus(marketId, MarketStatus.CANCELLED);
    }

    // Storage helper methods
    private setMarketCreator(marketId: u256, creator: Address): void {
        const pointer = this.getMarketPointer(marketId, 'creator');
        this._setAddressAt(pointer, creator);
    }

    private getMarketCreator(marketId: u256): Address {
        const pointer = this.getMarketPointer(marketId, 'creator');
        return this._getAddressAt(pointer);
    }

    private setMarketQuestion(marketId: u256, question: string): void {
        const pointer = this.getMarketPointer(marketId, 'question');
        this._setStringAt(pointer, question);
    }

    private setMarketDescription(marketId: u256, description: string): void {
        const pointer = this.getMarketPointer(marketId, 'description');
        this._setStringAt(pointer, description);
    }

    private setMarketEndTime(marketId: u256, endTime: u256): void {
        const pointer = this.getMarketPointer(marketId, 'endTime');
        this._setU256(pointer, endTime);
    }

    private getMarketEndTime(marketId: u256): u256 {
        const pointer = this.getMarketPointer(marketId, 'endTime');
        return this._getU256(pointer);
    }

    private setMarketResolutionTime(marketId: u256, resolutionTime: u256): void {
        const pointer = this.getMarketPointer(marketId, 'resolutionTime');
        this._setU256(pointer, resolutionTime);
    }

    private getMarketResolutionTime(marketId: u256): u256 {
        const pointer = this.getMarketPointer(marketId, 'resolutionTime');
        return this._getU256(pointer);
    }

    private setMarketResolver(marketId: u256, resolver: Address): void {
        const pointer = this.getMarketPointer(marketId, 'resolver');
        this._setAddressAt(pointer, resolver);
    }

    private getMarketResolver(marketId: u256): Address {
        const pointer = this.getMarketPointer(marketId, 'resolver');
        return this._getAddressAt(pointer);
    }

    private setMarketStatus(marketId: u256, status: u8): void {
        const pointer = this.getMarketPointer(marketId, 'status');
        this._setU8(pointer, status);
    }

    private getMarketStatus(marketId: u256): u8 {
        const pointer = this.getMarketPointer(marketId, 'status');
        return this._getU8(pointer);
    }

    private setMarketOutcome(marketId: u256, outcome: u8): void {
        const pointer = this.getMarketPointer(marketId, 'outcome');
        this._setU8(pointer, outcome);
    }

    private getMarketOutcome(marketId: u256): u8 {
        const pointer = this.getMarketPointer(marketId, 'outcome');
        return this._getU8(pointer);
    }

    private setMarketYesPool(marketId: u256, amount: u256): void {
        const pointer = this.getMarketPointer(marketId, 'yesPool');
        this._setU256(pointer, amount);
    }

    private getMarketYesPool(marketId: u256): u256 {
        const pointer = this.getMarketPointer(marketId, 'yesPool');
        return this._getU256(pointer);
    }

    private setMarketNoPool(marketId: u256, amount: u256): void {
        const pointer = this.getMarketPointer(marketId, 'noPool');
        this._setU256(pointer, amount);
    }

    private getMarketNoPool(marketId: u256): u256 {
        const pointer = this.getMarketPointer(marketId, 'noPool');
        return this._getU256(pointer);
    }

    private setMarketTotalPool(marketId: u256, amount: u256): void {
        const pointer = this.getMarketPointer(marketId, 'totalPool');
        this._setU256(pointer, amount);
    }

    private getMarketTotalPool(marketId: u256): u256 {
        const pointer = this.getMarketPointer(marketId, 'totalPool');
        return this._getU256(pointer);
    }

    private setUserBet(marketId: u256, user: Address, betOnYes: bool, amount: u256): void {
        const amountPointer = this.getUserBetPointer(marketId, user, 'amount');
        const sidePointer = this.getUserBetPointer(marketId, user, 'side');
        
        this._setU256(amountPointer, amount);
        this._setU8(sidePointer, betOnYes ? 1 : 0);
    }

    private getUserBetAmount(marketId: u256, user: Address): u256 {
        const pointer = this.getUserBetPointer(marketId, user, 'amount');
        return this._getU256(pointer);
    }

    private getUserBetSide(marketId: u256, user: Address): bool {
        const pointer = this.getUserBetPointer(marketId, user, 'side');
        return this._getU8(pointer) == 1;
    }

    private setUserClaimed(marketId: u256, user: Address, claimed: bool): void {
        const pointer = this.getUserBetPointer(marketId, user, 'claimed');
        this._setU8(pointer, claimed ? 1 : 0);
    }

    private hasUserClaimed(marketId: u256, user: Address): bool {
        const pointer = this.getUserBetPointer(marketId, user, 'claimed');
        return this._getU8(pointer) == 1;
    }

    private getMarketPointer(marketId: u256, field: string): u256 {
        const writer = new BytesWriter(64);
        writer.writeStringWithLength('market');
        writer.writeU256(marketId);
        writer.writeStringWithLength(field);
        return writer.getHash256();
    }

    private getUserBetPointer(marketId: u256, user: Address, field: string): u256 {
        const writer = new BytesWriter(96);
        writer.writeStringWithLength('bet');
        writer.writeU256(marketId);
        writer.writeAddress(user);
        writer.writeStringWithLength(field);
        return writer.getHash256();
    }

    // Helper methods for storage operations
    private _setU256(pointer: u256, value: u256): void {
        Blockchain.setStorageAt(pointer, value);
    }

    private _getU256(pointer: u256): u256 {
        return Blockchain.getStorageAt(pointer);
    }

    private _setU8(pointer: u256, value: u8): void {
        Blockchain.setStorageAt(pointer, u256.fromU32(value));
    }

    private _getU8(pointer: u256): u8 {
        const value = Blockchain.getStorageAt(pointer);
        return <u8>value.toU64();
    }

    private _setAddressAt(pointer: u256, address: Address): void {
        Blockchain.setStorageAt(pointer, address.toU256());
    }

    private _getAddressAt(pointer: u256): Address {
        const value = Blockchain.getStorageAt(pointer);
        return Address.fromU256(value);
    }

    private _setStringAt(pointer: u256, str: string): void {
        // Simple string storage - in production, use proper string encoding
        const writer = new BytesWriter(str.length);
        writer.writeStringWithLength(str);
        Blockchain.setStorageAt(pointer, writer.getHash256());
    }
}
