# OPNet Predictions - Decentralized Prediction Markets on Bitcoin L1

![Bitcoin](https://img.shields.io/badge/Bitcoin-Layer%201-orange)
![OPNet](https://img.shields.io/badge/OPNet-Smart%20Contracts-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

OPNet Predictions brings **decentralized prediction markets** directly to Bitcoin Layer 1 using OPNet smart contracts. This project enables trustless, transparent, and censorship-resistant prediction markets secured by Bitcoin's unparalleled security model.

### Key Features

🔐 **Bitcoin L1 Security** - All contracts run directly on Bitcoin, leveraging its security and decentralization

🪙 **PRED Token** - Native governance token powering the ecosystem with staking and incentive mechanisms

📊 **Prediction Markets** - Create and participate in markets for any future event

🗳️ **Decentralized Governance** - Token holders control protocol parameters and upgrades

💰 **Staking Rewards** - Earn rewards by staking PRED tokens and participating in governance

⚡ **On-Chain Activity** - Increases Bitcoin utility by bringing real DeFi functionality to the network

## Architecture

The protocol consists of four main smart contracts:

### 1. PredictionToken (PRED)
- OP_20 compliant token
- 1 billion total supply
- Governance voting rights
- Staking incentives
- Fee distribution

**Token Distribution:**
- 40% Ecosystem & Market Incentives
- 30% Staking Rewards Pool
- 15% Team & Development
- 15% Liquidity Pools

### 2. PredictionMarket
Core prediction market functionality:
- **Market Creation** - Anyone can create binary (Yes/No) prediction markets
- **Betting Mechanism** - Users bet on outcomes using BTC
- **Automated Payouts** - Winners claim proportional shares of the pool
- **Market Resolution** - Designated resolvers determine outcomes
- **Protocol Fees** - 2% fee on winnings to sustain the ecosystem

### 3. StakingContract
Token staking and rewards:
- **Flexible Lock Periods** - Short (1 day), Medium (1 week), Long (1 month)
- **Reward Distribution** - Block-based reward accrual
- **Early Withdrawal** - Available with 10% penalty
- **Governance Weight** - Longer locks = higher voting power (up to 2x multiplier)

### 4. GovernanceContract
Decentralized protocol governance:
- **Proposal System** - Create and vote on protocol changes
- **Timelock** - 2-day execution delay for security
- **Quorum Requirements** - 4% of total supply must participate
- **Weighted Voting** - Voting power based on staked tokens

## Smart Contract Overview

### Market Lifecycle

```
1. CREATE MARKET
   ├─ Creator submits question, end time, resolution time
   ├─ Designates resolver address
   └─ Market becomes ACTIVE

2. BETTING PERIOD
   ├─ Users place bets on YES or NO
   ├─ Pools accumulate on both sides
   └─ Betting closes at end time

3. RESOLUTION
   ├─ Resolver submits outcome after resolution time
   ├─ Market status changes to RESOLVED
   └─ Winners can now claim

4. CLAIM WINNINGS
   ├─ Winners claim proportional share of total pool
   ├─ 2% protocol fee deducted
   └─ Funds distributed to winners
```

### Governance Lifecycle

```
1. CREATE PROPOSAL
   ├─ Requires 10,000 PRED voting power
   ├─ 1 day delay before voting starts
   └─ Status: PENDING

2. VOTING PERIOD (5 days)
   ├─ Token holders vote FOR/AGAINST/ABSTAIN
   ├─ Voting weight = staked tokens × lock multiplier
   └─ Status: ACTIVE

3. FINALIZATION
   ├─ Check if quorum reached (4% of supply)
   ├─ FOR votes > AGAINST votes = SUCCEEDED
   └─ Otherwise = DEFEATED

4. EXECUTION (2 day timelock)
   ├─ Successful proposals enter timelock
   ├─ After delay, anyone can execute
   └─ Status: EXECUTED
```

## Use Cases

### 🎯 Prediction Markets
- **Sports** - Bet on game outcomes, championships, player performance
- **Politics** - Election results, policy decisions, approval ratings
- **Economics** - Stock prices, commodity values, inflation rates
- **Crypto** - Token prices, protocol launches, network upgrades
- **Entertainment** - Award shows, box office results, streaming metrics
- **Weather** - Temperature ranges, natural disasters, seasonal patterns

### 💎 Token Utility

**PRED Token Powers:**
1. **Governance** - Vote on protocol upgrades and parameters
2. **Staking** - Earn passive rewards by locking tokens
3. **Market Creation** - Required for creating new markets
4. **Fee Discounts** - Reduced protocol fees for token holders
5. **Incentives** - Rewards for market creators and liquidity providers

## Technical Specifications

### Contract Details

| Contract | Type | Purpose |
|----------|------|---------|
| PredictionToken | OP_20 | Governance & utility token |
| PredictionMarket | OP_NET | Core market logic |
| StakingContract | OP_NET | Token staking & rewards |
| GovernanceContract | OP_NET | Decentralized governance |

### Key Parameters

**Market Parameters:**
- Minimum Bet: 0.0001 BTC
- Protocol Fee: 2%
- Market Creation Fee: 0.001 BTC

**Staking Parameters:**
- Minimum Stake: 1,000 PRED
- Short Lock: 144 blocks (~1 day) = 1.25x voting weight
- Medium Lock: 1,008 blocks (~1 week) = 1.5x voting weight
- Long Lock: 4,320 blocks (~1 month) = 2x voting weight
- Early Withdrawal Penalty: 10%

**Governance Parameters:**
- Proposal Threshold: 10,000 PRED
- Voting Delay: 144 blocks (~1 day)
- Voting Period: 17,280 blocks (~5 days)
- Execution Delay: 2,880 blocks (~2 days)
- Quorum: 4% of total supply

## Project Structure

```
opnet-predictions/
├── src/
│   ├── contracts/
│   │   ├── PredictionToken.ts       # OP_20 governance token
│   │   ├── PredictionMarket.ts      # Core prediction market
│   │   ├── StakingContract.ts       # Token staking
│   │   └── GovernanceContract.ts    # Decentralized governance
│   └── index.ts                      # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
# Clone the repository
git clone https://github.com/Funmilayo21/Opnet-predictions.git
cd Opnet-predictions

# Install dependencies
npm install

# Build contracts
npm run build
```

## Development

### Prerequisites
- Node.js v16 or higher
- TypeScript
- OPNet Runtime SDK

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## Deployment

Contracts are deployed to Bitcoin Layer 1 via OPNet:

1. Configure deployment parameters
2. Deploy PredictionToken first
3. Deploy supporting contracts (Staking, Governance, Market)
4. Initialize cross-contract references
5. Transfer initial token allocations

## Why Bitcoin L1?

### Security Benefits
- **Immutable** - Protected by Bitcoin's hashpower
- **Censorship-Resistant** - No central authority can shut it down
- **Trustless** - Code is law, no intermediaries needed
- **Proven Track Record** - 15+ years of 99.98% uptime

### Economic Benefits
- **Bitcoin Utility** - Brings DeFi use cases to BTC holders
- **Network Effects** - Leverages Bitcoin's liquidity and adoption
- **Fee Economics** - Protocol fees stay in Bitcoin ecosystem
- **Value Accrual** - Increases on-chain activity and miner revenue

### Technical Benefits
- **OPNet Smart Contracts** - Full smart contract capabilities on Bitcoin
- **No Bridges** - No cross-chain risks or wrapped tokens
- **Native Integration** - Direct interaction with Bitcoin UTXOs
- **Developer Friendly** - TypeScript-based development

## Roadmap

### Phase 1: Foundation ✅
- [x] Core smart contracts
- [x] Token economics design
- [x] Governance framework
- [x] Staking mechanism

### Phase 2: Launch 🚧
- [ ] Mainnet deployment
- [ ] UI/UX interface
- [ ] Market creation tools
- [ ] Token distribution

### Phase 3: Growth 📈
- [ ] AMM integration
- [ ] Oracle partnerships
- [ ] Cross-protocol integrations
- [ ] Mobile applications

### Phase 4: Expansion 🌍
- [ ] Institutional partnerships
- [ ] Fiat on/off ramps
- [ ] Advanced market types
- [ ] Global compliance

## Security

- Smart contracts audited by [pending]
- Bug bounty program: [pending]
- Timelock on governance changes
- Emergency pause functionality
- Community-driven security reviews

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Community

- Website: [Coming Soon]
- Twitter: [@OPNetPredictions]
- Discord: [Join our community]
- Telegram: [Prediction Markets Channel]
- Forum: [Governance Discussion]

## License

MIT License - see LICENSE file for details

## Disclaimer

This is experimental software. Use at your own risk. Prediction markets may be subject to regulation in your jurisdiction. Always comply with local laws and regulations.

## Acknowledgments

- OPNet team for the Bitcoin smart contract platform
- Bitcoin Core developers
- Open source community

---

**Built with ❤️ for Bitcoin**

Bringing real DeFi to the world's most secure blockchain.