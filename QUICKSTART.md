# Quick Start Guide

Get up and running with OPNet Predictions in 5 minutes!

## Prerequisites

- Node.js v16+ installed
- Bitcoin wallet with BTC
- Basic understanding of prediction markets

## Installation

```bash
# Clone the repository
git clone https://github.com/Funmilayo21/Opnet-predictions.git
cd Opnet-predictions

# Install dependencies
npm install

# Build the project
npm run build
```

## Your First Market

### Step 1: Get PRED Tokens

```bash
# Get tokens from a DEX or liquidity pool
# Store your tokens in an OPNet-compatible wallet
```

### Step 2: Create a Market

```bash
# Set environment variables
export MARKET_CONTRACT="0x..." # Deployed contract address
export YOUR_ADDRESS="0x..."     # Your wallet address

# Create a prediction market
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method createMarket \
  --args "Will it rain tomorrow?" \
         "Market resolves YES if rainfall > 0.1 inches" \
         1709136000 \
         1709222400 \
         $YOUR_ADDRESS \
  --value 100000
```

### Step 3: Place a Bet

```bash
# Bet 0.01 BTC on YES
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method placeBet \
  --args 1 true 1000000 \
  --value 1000000
```

### Step 4: Resolve & Claim

```bash
# After the event, resolve the market (as resolver)
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method resolveMarket \
  --args 1 1  # 1=YES, 2=NO

# Claim your winnings (if you won)
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method claimWinnings \
  --args 1
```

## Stake Your Tokens

### Step 1: Approve Staking Contract

```bash
export STAKING_CONTRACT="0x..."
export PRED_TOKEN="0x..."

# Approve 10,000 PRED for staking
opnet-cli call \
  --contract $PRED_TOKEN \
  --method approve \
  --args $STAKING_CONTRACT 10000
```

### Step 2: Stake Tokens

```bash
# Stake for 1 week (1008 blocks)
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method stake \
  --args 10000 1008
```

### Step 3: Claim Rewards

```bash
# Claim your staking rewards
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method claimRewards
```

## Participate in Governance

### Step 1: Create a Proposal

```bash
export GOVERNANCE_CONTRACT="0x..."

# Create a proposal (requires 10K PRED voting power)
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method createProposal \
  --args "Reduce Protocol Fee" \
         "Lower market fee from 2% to 1.5%" \
         $MARKET_CONTRACT \
         "setFee(150)"
```

### Step 2: Vote on Proposal

```bash
# Vote FOR proposal #1
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT \
  --method castVote \
  --args 1 1  # 1=FOR, 0=AGAINST, 2=ABSTAIN
```

## Development Setup

### Run Local Node (Optional)

```bash
# Start Bitcoin node with OPNet support
bitcoin-opnet --testnet

# Deploy contracts locally
npm run deploy:local
```

### Run Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage
npm run test:coverage
```

### Build from Source

```bash
# Clean previous builds
npm run clean

# Build TypeScript
npm run build

# Verify build
ls dist/
```

## Common Operations

### Check Token Balance

```bash
opnet-cli call \
  --contract $PRED_TOKEN \
  --method balanceOf \
  --args $YOUR_ADDRESS
```

### Check Market Status

```bash
# Get market details
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method getMarket \
  --args 1
```

### Check Staking Info

```bash
# Check staked amount
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method getUserStakedAmount \
  --args $YOUR_ADDRESS

# Check voting weight
opnet-cli call \
  --contract $STAKING_CONTRACT \
  --method getVotingWeight \
  --args $YOUR_ADDRESS
```

## Web Interface (Coming Soon)

A user-friendly web interface is under development:

```bash
# Clone the frontend repo
git clone https://github.com/Funmilayo21/Opnet-predictions-ui.git

# Install dependencies
cd Opnet-predictions-ui
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to use the web interface.

## Troubleshooting

### "Insufficient balance"

Make sure you have enough:
- BTC for gas fees
- PRED tokens for operations
- Check with `balanceOf` method

### "Market not active"

Check market status:
```bash
opnet-cli call \
  --contract $MARKET_CONTRACT \
  --method getMarketStatus \
  --args MARKET_ID
```

### "Already voted"

Each address can only vote once per proposal. Use a different address if needed.

### "Transaction failed"

1. Check gas price is sufficient
2. Verify contract addresses are correct
3. Ensure you have required permissions
4. Review error message carefully

## Example Scripts

### Create Multiple Markets

```bash
#!/bin/bash
for i in {1..5}; do
  opnet-cli call \
    --contract $MARKET_CONTRACT \
    --method createMarket \
    --args "Market $i" "Description" 1709136000 1709222400 $YOUR_ADDRESS \
    --value 100000
done
```

### Batch Claim Winnings

```bash
#!/bin/bash
for market_id in 1 2 3 4 5; do
  opnet-cli call \
    --contract $MARKET_CONTRACT \
    --method claimWinnings \
    --args $market_id
done
```

### Monitor Staking Rewards

```bash
#!/bin/bash
while true; do
  rewards=$(opnet-cli call \
    --contract $STAKING_CONTRACT \
    --method calculatePendingRewards \
    --args $YOUR_ADDRESS)
  echo "Pending rewards: $rewards PRED"
  sleep 3600  # Check every hour
done
```

## Next Steps

1. **Read the Documentation**
   - [README.md](README.md) - Overview
   - [USAGE.md](USAGE.md) - Detailed usage guide
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details

2. **Join the Community**
   - Discord: Real-time chat
   - Telegram: Community discussion
   - Twitter: Updates and announcements

3. **Start Building**
   - Create your first market
   - Stake some tokens
   - Vote on proposals
   - Contribute code

4. **Explore Advanced Features**
   - Market creation strategies
   - Staking optimization
   - Governance participation
   - Trading strategies

## Resources

- **Documentation**: Full guides in this repo
- **API Reference**: Coming soon
- **SDK**: JavaScript/TypeScript SDK in development
- **Examples**: Sample applications and scripts

## Support

Need help?
- **GitHub Issues**: Bug reports and features
- **Discord**: Quick questions and support
- **Email**: support@opnetpredictions.com

## Security

- Test with small amounts first
- Never share private keys
- Verify contract addresses
- Review transactions before signing

---

**Ready to predict the future? Let's go! 🚀**
