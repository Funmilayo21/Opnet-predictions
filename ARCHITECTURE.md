# Architecture Overview

## System Architecture

OPNet Predictions is a decentralized prediction market platform built on Bitcoin Layer 1 using OPNet smart contracts. This document provides a detailed technical overview of the system architecture.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Bitcoin L1                           │
│                     (Security Layer)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      OPNet Runtime                           │
│              (Smart Contract Execution)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Prediction   │ │  Staking     │ │ Governance   │
│   Token      │ │  Contract    │ │  Contract    │
│  (OP_20)     │ │  (OP_NET)    │ │  (OP_NET)    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Prediction      │
              │    Market        │
              │   (OP_NET)       │
              └──────────────────┘
```

## Core Components

### 1. PredictionToken (OP_20)

**Purpose:** Governance and utility token

**Key Features:**
- OP_20 standard compliance
- Fixed supply (1B tokens)
- Burn functionality
- Voting rights tracking

**Storage Layout:**
```
balances: Map<Address, u256>         // Token balances
allowances: Map<Address, Map<Address, u256>>  // Spending allowances
totalSupply: u256                     // Total token supply
```

**Critical Methods:**
- `transfer(to, amount)`: Transfer tokens
- `approve(spender, amount)`: Approve spending
- `burn(amount)`: Reduce supply
- `votingPower(address)`: Get governance weight

### 2. PredictionMarket (OP_NET)

**Purpose:** Core prediction market functionality

**Market States:**
```
PENDING → ACTIVE → RESOLVED
            ↓
        CANCELLED
```

**Storage Layout:**
```
markets: Map<u256, Market> {
    creator: Address
    question: string
    endTime: u256
    resolutionTime: u256
    resolver: Address
    status: u8
    outcome: u8
    yesPool: u256
    noPool: u256
    totalPool: u256
}

bets: Map<u256, Map<Address, Bet>> {
    amount: u256
    side: bool (true=YES, false=NO)
    claimed: bool
}
```

**Critical Methods:**
- `createMarket(...)`: Create new market
- `placeBet(marketId, side, amount)`: Place bet
- `resolveMarket(marketId, outcome)`: Set outcome
- `claimWinnings(marketId)`: Claim payouts

**Payout Algorithm:**
```
winningShare = (userBet / winningPool) × totalPool
protocolFee = winningShare × 0.02
userPayout = winningShare - protocolFee
```

### 3. StakingContract (OP_NET)

**Purpose:** Token staking and reward distribution

**Staking Flow:**
```
APPROVE → STAKE → LOCK PERIOD → CLAIM REWARDS → WITHDRAW
            ↓
    EARLY WITHDRAW (with penalty)
```

**Storage Layout:**
```
stakes: Map<Address, Stake> {
    amount: u256
    unlockBlock: u256
    lastRewardBlock: u256
}

totalStaked: u256
rewardPool: u256
```

**Critical Methods:**
- `stake(amount, lockPeriod)`: Lock tokens
- `withdraw(amount)`: Withdraw tokens
- `claimRewards()`: Claim staking rewards
- `getVotingWeight(address)`: Calculate governance weight

**Reward Calculation:**
```
rewards = (stakedAmount × blocksSinceLastClaim × rewardRate) / totalStaked
votingWeight = stakedAmount × lockMultiplier
  where lockMultiplier = 1.0x to 2.0x based on remaining lock time
```

### 4. GovernanceContract (OP_NET)

**Purpose:** Decentralized protocol governance

**Proposal Lifecycle:**
```
CREATE → PENDING → ACTIVE → {SUCCEEDED, DEFEATED}
                              ↓
                          TIMELOCK → EXECUTED
```

**Storage Layout:**
```
proposals: Map<u256, Proposal> {
    proposer: Address
    title: string
    description: string
    target: Address
    calldata: string
    votingStart: u256
    votingEnd: u256
    executionTime: u256
    status: u8
    forVotes: u256
    againstVotes: u256
    abstainVotes: u256
}

votes: Map<u256, Map<Address, Vote>> {
    support: u8 (0=against, 1=for, 2=abstain)
    weight: u256
    voted: bool
}
```

**Critical Methods:**
- `createProposal(...)`: Create proposal
- `castVote(proposalId, support)`: Vote
- `finalizeProposal(proposalId)`: Tally votes
- `executeProposal(proposalId)`: Execute after timelock

**Voting Power:**
```
votingPower = stakingContract.getVotingWeight(voter)
quorumReached = (forVotes + againstVotes) >= (totalSupply × 0.04)
proposalPasses = quorumReached && forVotes > againstVotes
```

## Data Flow Diagrams

### Market Creation & Betting Flow

```
User                Market Contract           Blockchain
  │                       │                       │
  ├──createMarket()──────►│                       │
  │                       ├──store market data───►│
  │                       ◄─────market ID─────────┤
  │◄─────market ID────────┤                       │
  │                       │                       │
  ├──placeBet()──────────►│                       │
  │                       ├──validate market─────►│
  │                       ├──update pools────────►│
  │                       ├──store bet───────────►│
  │◄─────success──────────┤                       │
```

### Staking Flow

```
User          Token Contract    Staking Contract    Blockchain
  │                 │                  │                 │
  ├──approve()─────►│                  │                 │
  │                 ├──set allowance──►│                 │
  │◄───success──────┤                  │                 │
  │                 │                  │                 │
  ├──stake()────────────────────────────►│                 │
  │                 │                  ├──check allowance►│
  │                 │◄─transferFrom────┤                 │
  │                 ├──transfer tokens►│                 │
  │                 │                  ├──update stake───►│
  │◄──────────────────success──────────┤                 │
```

### Governance Flow

```
User              Governance Contract       Staking Contract
  │                       │                        │
  ├─createProposal()─────►│                        │
  │                       ├──check voting power───►│
  │                       ◄───voting power─────────┤
  │                       ├──store proposal────────►
  │◄───proposal ID────────┤                        │
  │                       │                        │
  ├─castVote()───────────►│                        │
  │                       ├──check voting power───►│
  │                       ◄───voting power─────────┤
  │                       ├──record vote───────────►
  │◄────success───────────┤                        │
```

## Storage Patterns

### Key-Value Storage

All contracts use a hash-based key-value storage pattern:

```typescript
// Generate unique storage pointer
function getStoragePointer(namespace: string, id: u256, field: string): u256 {
    const writer = new BytesWriter(64);
    writer.writeStringWithLength(namespace);
    writer.writeU256(id);
    writer.writeStringWithLength(field);
    return writer.getHash256();
}

// Store value
Blockchain.setStorageAt(pointer, value);

// Retrieve value
const value = Blockchain.getStorageAt(pointer);
```

### Storage Namespaces

- `market:*`: Market data
- `bet:*`: User bets
- `staking:*`: Staking data
- `proposal:*`: Governance proposals
- `vote:*`: Governance votes

## Security Model

### Access Control

**Market Contract:**
- Anyone can create markets (with fee)
- Anyone can place bets (during betting period)
- Only designated resolver can resolve
- Only creator can cancel (before end)

**Staking Contract:**
- Anyone can stake (after token approval)
- Only staker can withdraw their stake
- Anyone can claim their own rewards

**Governance Contract:**
- Users with 10K+ PRED can propose
- Stakers can vote (weight = staked amount)
- Anyone can finalize/execute (after timelock)

### Economic Security

**Market Manipulation Prevention:**
- Minimum bet sizes
- Market creation fees
- Resolver reputation (future)
- Dispute resolution (future)

**Governance Attack Prevention:**
- Proposal threshold (10K PRED)
- Voting delay (1 day)
- Timelock (2 days)
- Quorum requirements (4%)

**Staking Risks:**
- Early withdrawal penalties (10%)
- Lock periods enforce commitment
- Reward rate caps

### Upgrade Strategy

Contracts are immutable, but upgradeable through governance:

1. **Parameter Updates**: Governance can adjust fees, timeouts, etc.
2. **New Contract Deployment**: Deploy v2, migrate through governance
3. **State Migration**: Governance-controlled migration process
4. **Backwards Compatibility**: Maintain interfaces when possible

## Performance Considerations

### Gas Optimization

**Storage Efficiency:**
- Pack multiple values in single slots
- Use u8 for small enums
- Minimize storage operations

**Computation Efficiency:**
- Cache repeated calculations
- Use batch operations where possible
- Optimize loops

### Scalability

**Current Limits:**
- ~100 markets/day expected
- ~1000 bets/day per market
- ~10 proposals/month

**Future Optimizations:**
- Layer 2 for high-frequency trading
- State channels for rapid betting
- Sharding for market isolation

## Integration Points

### External Systems

**DEX Integration:**
- Token swaps
- Liquidity pools
- Price oracles

**Oracle Integration:**
- Market data feeds
- Resolution automation
- Price verification

**Wallet Integration:**
- OPNet wallets
- Bitcoin wallets
- Web3 libraries

## Monitoring & Analytics

### On-Chain Events

**Market Events:**
- `MarketCreated(id, creator, question)`
- `BetPlaced(marketId, user, amount, side)`
- `MarketResolved(marketId, outcome)`
- `WinningsClaimed(marketId, user, amount)`

**Staking Events:**
- `Staked(user, amount, unlockBlock)`
- `Withdrawn(user, amount, penalty)`
- `RewardsClaimed(user, amount)`

**Governance Events:**
- `ProposalCreated(id, proposer, title)`
- `VoteCast(proposalId, voter, support, weight)`
- `ProposalFinalized(id, status)`
- `ProposalExecuted(id)`

### Metrics to Track

**Protocol Health:**
- Total value locked (TVL)
- Daily active users (DAU)
- Transaction volume
- Protocol revenue

**Market Metrics:**
- Active markets count
- Average market size
- Resolution accuracy
- User retention

**Token Metrics:**
- Circulating supply
- Staking ratio
- Holder distribution
- Price volatility

## Future Enhancements

### Planned Features

1. **Oracle Integration**: Automated market resolution
2. **AMM Markets**: Continuous liquidity markets
3. **Multi-Outcome Markets**: Beyond binary yes/no
4. **Social Features**: Following, reputation, leaderboards
5. **Mobile Apps**: iOS/Android applications
6. **Analytics Dashboard**: Advanced market analytics

### Research Areas

1. **Layer 2 Scaling**: Optimistic rollups for Bitcoin
2. **Zero-Knowledge Proofs**: Privacy-preserving markets
3. **Cross-Chain**: Bridge to other networks
4. **AI Resolution**: ML-powered market resolution

## Conclusion

The OPNet Predictions architecture provides:

✅ **Security**: Bitcoin L1 security guarantees  
✅ **Decentralization**: No single point of failure  
✅ **Scalability**: Efficient storage and computation  
✅ **Extensibility**: Modular design for future upgrades  
✅ **Usability**: Clear interfaces and patterns  

The system is production-ready for initial deployment with clear paths for future enhancement.

---

**Last Updated:** February 2026  
**Version:** 1.0.0
