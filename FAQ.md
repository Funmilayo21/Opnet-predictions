# Frequently Asked Questions (FAQ)

## General Questions

### What is OPNet Predictions?

OPNet Predictions is a decentralized prediction market platform built directly on Bitcoin Layer 1 using OPNet smart contracts. It allows users to create and participate in prediction markets for any future event, with outcomes secured by Bitcoin's security model.

### Why build on Bitcoin instead of Ethereum or other chains?

**Security**: Bitcoin is the most secure blockchain with the highest hashrate and longest track record.

**Decentralization**: Bitcoin has no central leadership or single point of failure.

**Trust**: Bitcoin is the most trusted cryptocurrency with the largest user base.

**Innovation**: OPNet brings smart contract capabilities to Bitcoin without compromising security.

**Ecosystem**: Taps into Bitcoin's massive liquidity and adoption.

### What is OPNet?

OPNet is a smart contract execution layer for Bitcoin Layer 1. It enables full smart contract capabilities (similar to Ethereum) while maintaining Bitcoin's security guarantees. Transactions are settled directly on the Bitcoin blockchain.

### Is this a sidechain or Layer 2?

No, OPNet Predictions runs directly on Bitcoin Layer 1. Contracts are deployed to Bitcoin and all state is stored on the Bitcoin blockchain. There are no bridges, wrapped tokens, or separate chains involved.

## Token Questions

### What is the PRED token?

PRED is the native governance and utility token of OPNet Predictions. It's an OP_20 token (Bitcoin's equivalent of ERC-20) with a fixed supply of 1 billion tokens.

### What can I do with PRED tokens?

- **Vote** on governance proposals
- **Stake** to earn rewards
- **Get discounts** on market fees
- **Create markets** (required for market creation)
- **Earn incentives** as a market creator

### How do I get PRED tokens?

At launch, PRED tokens will be available through:
1. Decentralized exchanges (DEXs)
2. Liquidity mining programs
3. Market creation rewards
4. Staking rewards
5. Centralized exchanges (post-launch)

### Is the supply fixed or inflationary?

The supply is **fixed** at 1 billion tokens. No new tokens can be minted. The protocol includes burn mechanisms that make it **deflationary** over time:
- 10% of protocol fees are burned
- Unclaimed rewards are burned after 2 years
- Community-voted burns through governance

### What's the token distribution?

- 40% Ecosystem & Market Incentives
- 30% Staking Rewards Pool
- 15% Team & Development (vested)
- 15% Liquidity Pools

## Market Questions

### What types of predictions can I make?

Any binary (yes/no) outcome:
- **Sports**: Game results, championship winners
- **Politics**: Election outcomes, policy decisions
- **Economics**: Stock prices, commodity values
- **Crypto**: Token prices, protocol launches
- **Entertainment**: Award shows, box office results
- **Weather**: Temperature ranges, natural disasters

### How do prediction markets work?

1. **Market Creation**: Someone creates a market with a question
2. **Betting**: Users bet BTC on YES or NO outcomes
3. **Resolution**: After the event, a resolver determines the outcome
4. **Payouts**: Winners claim proportional shares of the total pool

### How are payouts calculated?

```
Your Winning Share = (Your Bet / Total Winning Bets) × Total Pool
Protocol Fee = 2% of winning share
Your Payout = Winning Share - Fee
```

**Example:**
- Total pool: 10 BTC (7 BTC on YES, 3 BTC on NO)
- You bet: 1 BTC on YES
- Outcome: YES wins
- Your share: (1 / 7) × 10 = 1.43 BTC
- Fee: 1.43 × 0.02 = 0.029 BTC
- Your payout: 1.43 - 0.029 = 1.40 BTC
- Net profit: 0.40 BTC (40% gain)

### Who determines the outcome of a market?

Each market has a designated **resolver** - an address authorized to report the outcome. In the future, we plan to implement:
- Decentralized oracle networks
- Community resolution (dispute system)
- Automated resolution (for objective data)

### What if the resolver is wrong or dishonest?

Currently, choose markets with trusted resolvers. Future enhancements include:
- Dispute resolution mechanism
- Resolver reputation system
- Stake requirements for resolvers
- Multi-resolver consensus
- Community appeals

### What are the fees?

- **Market Creation**: 0.001 BTC per market
- **Betting**: No fees to place bets
- **Winning Payouts**: 2% protocol fee on winnings
- **Losing Bets**: No additional fees (you lose your stake)

### What's the minimum bet?

Minimum bet is 0.0001 BTC (10,000 satoshis) to prevent spam and ensure meaningful markets.

### Can I cancel my bet?

No, bets are final once placed. However:
- Market creator can cancel the entire market before betting ends
- All participants get refunds if a market is cancelled
- Choose carefully before betting!

## Staking Questions

### How does staking work?

1. Approve the staking contract to spend your PRED tokens
2. Choose a lock period (1 day, 1 week, or 1 month)
3. Stake your tokens
4. Earn rewards over time
5. Claim rewards anytime
6. Withdraw tokens after lock period

### What are the staking rewards?

Lock periods determine your APY and voting weight:

| Lock Period | Base APY | Voting Weight |
|-------------|----------|---------------|
| 1 day       | 12%      | 1.25x         |
| 1 week      | 18%      | 1.5x          |
| 1 month     | 25%      | 2.0x          |

APY is variable based on total staked amount and protocol revenue.

### Can I withdraw early?

Yes, but with a **10% penalty** on your staked amount. The penalty is distributed to other stakers.

### Where do staking rewards come from?

1. **Reward Pool**: 300M PRED allocated for staking rewards
2. **Protocol Fees**: 40% of protocol revenue goes to stakers
3. **Market Incentives**: Bonus rewards for market participation

### Do I need to re-stake rewards?

No, rewards are separate from your stake. You can:
- Claim rewards and keep them liquid
- Re-stake rewards for compound growth
- Use rewards for other purposes

## Governance Questions

### How does governance work?

1. **Create Proposal**: Requires 10,000 PRED voting power
2. **Voting Delay**: 1 day before voting starts
3. **Voting Period**: 5 days to cast votes
4. **Finalization**: Check quorum and tally votes
5. **Timelock**: 2 day delay before execution
6. **Execution**: Proposal changes take effect

### What can governance control?

- Protocol parameters (fees, minimums, timeouts)
- Treasury spending
- Smart contract upgrades
- Partnership approvals
- Dispute resolutions
- Emergency actions

### How much voting power do I have?

Voting power = Staked PRED × Lock Multiplier

- Unstaked tokens: No voting power
- 1 day lock: 1.25x multiplier
- 1 week lock: 1.5x multiplier
- 1 month lock: 2.0x multiplier

### What's the quorum requirement?

Proposals need 4% of total supply to participate (for + against votes). Abstain votes don't count toward quorum but are recorded.

### Can I change my vote?

No, votes are final once cast. Think carefully before voting!

## Technical Questions

### Do I need Bitcoin or BTC?

Yes, you need BTC for:
- Gas fees for transactions
- Placing bets on markets

You need PRED tokens for:
- Staking
- Governance voting
- Market creation
- Fee discounts

### What wallet do I need?

Any OPNet-compatible wallet that supports:
- Bitcoin transactions
- OP_20 tokens (like PRED)
- Smart contract interactions

### Is there a frontend/UI?

The smart contracts are deployed on-chain. Multiple frontends can interact with them:
- Official web interface (coming soon)
- Third-party interfaces
- Direct contract calls via CLI
- Programmatic access via SDKs

### Are the contracts audited?

Audits are planned before mainnet launch. Current status:
- [ ] Internal security review
- [ ] External audit #1
- [ ] External audit #2
- [ ] Bug bounty program
- [ ] Formal verification

### Is the code open source?

Yes! The entire codebase is open source under the MIT License. You can:
- Review the code
- Contribute improvements
- Fork for your own use
- Build on top of it

### Can I run my own node?

Yes, you can run a Bitcoin full node with OPNet support to:
- Validate transactions independently
- Submit transactions directly
- Query contract state
- Build applications

## Economic Questions

### How does the protocol make money?

Revenue sources:
1. 2% fee on winning market payouts
2. 0.001 BTC market creation fee
3. Premium features (future)
4. API access (future)

### Where does the revenue go?

Protocol fee distribution:
- 40% → Staking rewards
- 30% → Treasury (governance controlled)
- 20% → Development fund
- 10% → Token burns

### Is this sustainable long-term?

Yes, the economic model is designed for sustainability:
- Revenue from real usage (market fees)
- Decreasing token emissions over time
- Break-even expected by Year 3
- Deflationary tokenomics
- Community-governed treasury

### What's the total addressable market?

Global prediction markets:
- Online betting: $250B annually
- Fantasy sports: $20B annually
- Political betting: $5B annually
- Crypto prediction markets: $1B+ annually

## Risk Questions

### What are the risks?

**Smart Contract Risk**: Bugs could lead to loss of funds
- Mitigation: Audits, testing, bug bounties

**Market Risk**: Low liquidity or participation
- Mitigation: Incentives, marketing, partnerships

**Regulatory Risk**: Legal restrictions in some jurisdictions
- Mitigation: Decentralization, compliance research

**Oracle Risk**: Incorrect market resolution
- Mitigation: Trusted resolvers, future dispute system

**Economic Risk**: Token price volatility
- Mitigation: Utility-driven demand, deflationary mechanics

### Is prediction market betting legal?

It depends on your jurisdiction. In many places:
- Prediction markets are legal
- Information markets are protected
- Decentralized platforms have different treatment

**Always check local laws before participating.**

### Can I lose more than I bet?

No! Your maximum loss is limited to your bet amount. Unlike leveraged trading or options, you can't lose more than you put in.

### Can the protocol be shut down?

No central authority can shut down the protocol because:
- Contracts are on Bitcoin L1
- No admin keys or backdoors
- Decentralized governance
- Permissionless access
- Multiple frontends possible

## Support Questions

### How do I get help?

- **Documentation**: Read the guides in this repo
- **Discord**: Join for real-time chat
- **Telegram**: Community discussion
- **GitHub**: Technical issues and bugs
- **Email**: support@opnetpredictions.com

### I found a bug. What should I do?

1. **Security bugs**: Email security@opnetpredictions.com (do not publish)
2. **Regular bugs**: Open a GitHub issue
3. **Bug bounty**: Rewards for critical findings

### Can I contribute to the project?

Yes! We welcome contributions:
- Code improvements
- Documentation
- Testing
- Design
- Community support
- Translations

See CONTRIBUTING.md for guidelines.

### Where can I learn more?

- **README.md**: Project overview
- **USAGE.md**: How to use the platform
- **DEPLOYMENT.md**: Deployment guide
- **ARCHITECTURE.md**: Technical architecture
- **TOKENOMICS.md**: Token economics
- **CONTRIBUTING.md**: Contribution guide

### When is the mainnet launch?

**Testnet**: Available now  
**Mainnet**: Q2 2026 (tentative)

Timeline:
- [x] Smart contracts completed
- [ ] Security audits
- [ ] Testnet deployment
- [ ] UI/UX development
- [ ] Marketing campaign
- [ ] Mainnet launch

---

**Still have questions?**

Join our Discord or Telegram for real-time support from the community!

**Important**: This FAQ is for informational purposes only and does not constitute financial advice. Always do your own research and understand the risks before participating in prediction markets or cryptocurrency investments.
