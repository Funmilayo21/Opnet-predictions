# Usage Guide

Complete guide for interacting with OPNet Predictions smart contracts.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Token Operations](#token-operations)
3. [Prediction Markets](#prediction-markets)
4. [Staking](#staking)
5. [Governance](#governance)
6. [Examples](#examples)

## Getting Started

### Prerequisites

- Bitcoin wallet with BTC for gas fees
- PRED tokens (get from DEX or liquidity pools)
- OPNet-compatible wallet or CLI

### Connect to Contracts

```javascript
import { PredictionToken, PredictionMarket, StakingContract, GovernanceContract } from 'opnet-predictions';

// Contract addresses (update with actual deployed addresses)
const PRED_TOKEN = '0x...';
const MARKET_CONTRACT = '0x...';
const STAKING_CONTRACT = '0x...';
const GOVERNANCE_CONTRACT = '0x...';
```

## Token Operations

### Check Balance

```bash
opnet-cli call \
  --contract $PRED_TOKEN \
  --method balanceOf \
  --args $YOUR_ADDRESS
```

### Transfer Tokens

```bash
opnet-cli call \
  --contract $PRED_TOKEN \
  --method transfer \
  --args $RECIPIENT_ADDRESS $AMOUNT
```

### Approve Spending

```bash
opnet-cli call \
  --contract $PRED_TOKEN \
  --method approve \
  --args $SPENDER_ADDRESS $AMOUNT
```

### Burn Tokens

```bash
opnet-cli call \
  --contract $PRED_TOKEN \
  --method burn \
  --args $AMOUNT
```

## Prediction Markets

### Create a Market

```bash
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method createMarket \
  --args "Will Bitcoin reach $100k by end of 2026?" \
         "Prediction market for BTC price target" \
         $END_TIMESTAMP \
         $RESOLUTION_TIMESTAMP \
         $RESOLVER_ADDRESS \
  --value 0.001 # Market creation fee
```

**Parameters:**
- `question`: Clear, unambiguous question (string)
- `description`: Detailed description and resolution criteria (string)
- `endTime`: Unix timestamp when betting closes (u256)
- `resolutionTime`: Unix timestamp when market can be resolved (u256)
- `resolver`: Address authorized to resolve the market (address)

**Returns:** Market ID (u256)

### Place a Bet

```bash
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method placeBet \
  --args $MARKET_ID $BET_ON_YES $AMOUNT \
  --value $AMOUNT
```

**Parameters:**
- `marketId`: ID of the market (u256)
- `betOnYes`: true for YES, false for NO (bool)
- `amount`: Bet amount in satoshis (u256)

**Example:**
```bash
# Bet 0.01 BTC on YES
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method placeBet \
  --args 1 true 1000000 \
  --value 1000000
```

### Resolve Market

```bash
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method resolveMarket \
  --args $MARKET_ID $OUTCOME
```

**Parameters:**
- `marketId`: ID of the market (u256)
- `outcome`: 1 for YES, 2 for NO (u8)

**Note:** Only the designated resolver can call this method after resolution time.

### Claim Winnings

```bash
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method claimWinnings \
  --args $MARKET_ID
```

**Returns:** Amount of winnings claimed (u256)

### Cancel Market

```bash
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method cancelMarket \
  --args $MARKET_ID
```

**Note:** Only market creator can cancel before end time.

## Staking

### Stake Tokens

```bash
# First approve staking contract to spend tokens
opnet-cli call \
  --contract $PRED_TOKEN \
  --method approve \
  --args $STAKING_CONTRACT $AMOUNT

# Then stake
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method stake \
  --args $AMOUNT $LOCK_PERIOD
```

**Lock Periods:**
- Short: 144 blocks (~1 day) = 1.25x voting weight
- Medium: 1,008 blocks (~1 week) = 1.5x voting weight
- Long: 4,320 blocks (~1 month) = 2x voting weight

**Example:**
```bash
# Stake 10,000 PRED for 1 week
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method stake \
  --args 10000 1008
```

### Withdraw Staked Tokens

```bash
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method withdraw \
  --args $AMOUNT
```

**Note:** 10% penalty applies if withdrawn before lock period ends.

### Claim Staking Rewards

```bash
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method claimRewards
```

**Returns:** Amount of rewards claimed (u256)

### Check Staking Info

```bash
# Check your staked amount
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method getUserStakedAmount \
  --args $YOUR_ADDRESS

# Check unlock block
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method getUserUnlock \
  --args $YOUR_ADDRESS

# Check voting weight
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method getVotingWeight \
  --args $YOUR_ADDRESS
```

## Governance

### Create Proposal

```bash
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method createProposal \
  --args "Reduce Protocol Fee" \
         "Proposal to reduce market protocol fee from 2% to 1.5%" \
         $TARGET_CONTRACT \
         $CALLDATA
```

**Parameters:**
- `title`: Proposal title (string)
- `description`: Detailed description (string)
- `target`: Contract address to call (address)
- `calldata`: Encoded function call (string)

**Requirements:**
- Must have 10,000 PRED voting power
- Staked tokens count towards voting power

**Returns:** Proposal ID (u256)

### Vote on Proposal

```bash
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method castVote \
  --args $PROPOSAL_ID $SUPPORT
```

**Parameters:**
- `proposalId`: ID of the proposal (u256)
- `support`: 0=against, 1=for, 2=abstain (u8)

**Example:**
```bash
# Vote FOR proposal #1
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method castVote \
  --args 1 1
```

### Finalize Proposal

```bash
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method finalizeProposal \
  --args $PROPOSAL_ID
```

**Note:** Can only be called after voting period ends. Checks quorum and vote outcome.

### Execute Proposal

```bash
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method executeProposal \
  --args $PROPOSAL_ID
```

**Note:** Can only be executed after:
- Proposal has succeeded
- Timelock delay (2 days) has passed

### Check Proposal Status

```bash
# Get vote counts
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method getProposalVotes \
  --args $PROPOSAL_ID
```

**Returns:** Array of [forVotes, againstVotes, abstainVotes]

## Examples

### Complete Market Creation Flow

```bash
#!/bin/bash

# 1. Create a market
MARKET_ID=$(opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method createMarket \
  --args "Will ETH reach $5000 in 2026?" \
         "Market resolves YES if ETH trades at $5000+ on any major exchange" \
         1767225600 \
         1767312000 \
         $RESOLVER_ADDRESS \
  --value 100000 \
  --output json | jq -r '.result')

echo "Created market ID: $MARKET_ID"

# 2. Place a bet on YES
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method placeBet \
  --args $MARKET_ID true 500000 \
  --value 500000

echo "Placed bet on YES"

# 3. Wait for market to end and get resolved...

# 4. Claim winnings (if you won)
WINNINGS=$(opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method claimWinnings \
  --args $MARKET_ID \
  --output json | jq -r '.result')

echo "Claimed winnings: $WINNINGS satoshis"
```

### Complete Staking Flow

```bash
#!/bin/bash

AMOUNT=10000
LOCK_PERIOD=4320 # 1 month

# 1. Approve staking contract
opnet-cli call \
  --contract $PRED_TOKEN \
  --method approve \
  --args $STAKING_CONTRACT $AMOUNT

# 2. Stake tokens
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method stake \
  --args $AMOUNT $LOCK_PERIOD

echo "Staked $AMOUNT PRED for $LOCK_PERIOD blocks"

# 3. Wait and claim rewards periodically
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method claimRewards

# 4. Withdraw after lock period
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method withdraw \
  --args $AMOUNT
```

### Complete Governance Flow

```bash
#!/bin/bash

# 1. Create a proposal
PROPOSAL_ID=$(opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method createProposal \
  --args "Reduce Protocol Fee" \
         "Reduce market fee from 2% to 1.5% to increase volume" \
         $MARKET_CONTRACT \
         "setProtocolFee(150)" \
  --output json | jq -r '.result')

echo "Created proposal ID: $PROPOSAL_ID"

# 2. Wait for voting delay (1 day)
sleep 86400

# 3. Vote on proposal
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method castVote \
  --args $PROPOSAL_ID 1

echo "Voted FOR proposal"

# 4. Wait for voting period (5 days)
sleep 432000

# 5. Finalize proposal
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method finalizeProposal \
  --args $PROPOSAL_ID

# 6. Wait for timelock (2 days)
sleep 172800

# 7. Execute proposal
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method executeProposal \
  --args $PROPOSAL_ID

echo "Proposal executed!"
```

## Best Practices

### Market Creation
- Write clear, unambiguous questions
- Define resolution criteria precisely
- Choose trusted resolvers
- Set appropriate time windows
- Test on testnet first

### Betting
- Research markets thoroughly
- Start with small amounts
- Diversify across markets
- Understand the risks
- Check pool sizes and odds

### Staking
- Longer locks = higher rewards
- Don't stake funds you need soon
- Claim rewards regularly
- Monitor unlock dates
- Plan for early withdrawal penalties

### Governance
- Read proposals carefully
- Participate actively
- Consider long-term impacts
- Engage in discussions
- Vote based on merit

## Troubleshooting

### Common Issues

**"Insufficient balance"**
- Check token balance
- Ensure wallet has enough BTC for gas

**"Market not active"**
- Verify market status
- Check if betting period ended

**"Already voted"**
- Each address can only vote once
- Use different address if needed

**"Voting not started"**
- Wait for voting delay period
- Check proposal timing

**"Unauthorized resolver"**
- Only designated resolver can resolve
- Contact market creator if dispute

## Support

- Documentation: [docs.opnetpredictions.com]
- Discord: [discord.gg/opnetpredictions]
- Telegram: [@opnetpredictions]
- Email: support@opnetpredictions.com

## Security Tips

1. **Never share private keys**
2. **Verify contract addresses**
3. **Start with small amounts**
4. **Use hardware wallets**
5. **Double-check transactions**
6. **Keep software updated**
7. **Report suspicious activity**

---

**Happy Predicting! 🎯**
