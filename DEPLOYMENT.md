# Deployment Guide

## Prerequisites

- Bitcoin node with OPNet support
- Deployment wallet with BTC for gas fees
- OPNet CLI tools installed

## Deployment Steps

### 1. Prepare Environment

```bash
# Set environment variables
export BITCOIN_RPC_URL="your-rpc-url"
export DEPLOYER_PRIVATE_KEY="your-private-key"
export NETWORK="mainnet" # or "testnet"
```

### 2. Deploy Contracts

Deploy in the following order:

#### Step 1: Deploy PredictionToken

```bash
opnet-cli deploy \
  --contract src/contracts/PredictionToken.ts \
  --network $NETWORK \
  --gas-limit 1000000
```

Save the deployed contract address as `PRED_TOKEN_ADDRESS`.

#### Step 2: Deploy StakingContract

```bash
opnet-cli deploy \
  --contract src/contracts/StakingContract.ts \
  --network $NETWORK \
  --gas-limit 1000000
```

Save the deployed contract address as `STAKING_CONTRACT_ADDRESS`.

#### Step 3: Initialize Staking Contract

```bash
opnet-cli call \
  --contract $STAKING_CONTRACT_ADDRESS \
  --method initialize \
  --args $PRED_TOKEN_ADDRESS \
  --network $NETWORK
```

#### Step 4: Deploy GovernanceContract

```bash
opnet-cli deploy \
  --contract src/contracts/GovernanceContract.ts \
  --network $NETWORK \
  --gas-limit 1000000
```

Save the deployed contract address as `GOVERNANCE_CONTRACT_ADDRESS`.

#### Step 5: Initialize Governance Contract

```bash
opnet-cli call \
  --contract $GOVERNANCE_CONTRACT_ADDRESS \
  --method initialize \
  --args $PRED_TOKEN_ADDRESS $STAKING_CONTRACT_ADDRESS \
  --network $NETWORK
```

#### Step 6: Deploy PredictionMarket

```bash
opnet-cli deploy \
  --contract src/contracts/PredictionMarket.ts \
  --network $NETWORK \
  --gas-limit 1000000
```

Save the deployed contract address as `MARKET_CONTRACT_ADDRESS`.

### 3. Initial Token Distribution

Distribute PRED tokens according to tokenomics:

```bash
# Ecosystem allocation (40%)
opnet-cli call \
  --contract $PRED_TOKEN_ADDRESS \
  --method transfer \
  --args $ECOSYSTEM_WALLET 400000000 \
  --network $NETWORK

# Staking rewards (30%)
opnet-cli call \
  --contract $PRED_TOKEN_ADDRESS \
  --method transfer \
  --args $STAKING_CONTRACT_ADDRESS 300000000 \
  --network $NETWORK

# Team allocation (15%)
opnet-cli call \
  --contract $PRED_TOKEN_ADDRESS \
  --method transfer \
  --args $TEAM_WALLET 150000000 \
  --network $NETWORK

# Liquidity pool (15%)
opnet-cli call \
  --contract $PRED_TOKEN_ADDRESS \
  --method transfer \
  --args $LIQUIDITY_WALLET 150000000 \
  --network $NETWORK
```

### 4. Verify Deployment

```bash
# Check token total supply
opnet-cli call \
  --contract $PRED_TOKEN_ADDRESS \
  --method totalSupply \
  --network $NETWORK

# Verify staking contract initialization
opnet-cli call \
  --contract $STAKING_CONTRACT_ADDRESS \
  --method getTotalStaked \
  --network $NETWORK
```

## Post-Deployment Checklist

- [ ] All contracts deployed successfully
- [ ] Contract addresses documented
- [ ] Token distribution completed
- [ ] Staking contract initialized
- [ ] Governance contract initialized
- [ ] Test transactions executed
- [ ] Frontend updated with contract addresses
- [ ] Block explorer verified
- [ ] Announcement prepared

## Contract Addresses (Update After Deployment)

```
PredictionToken: 0x...
StakingContract: 0x...
GovernanceContract: 0x...
PredictionMarket: 0x...
```

## Security Considerations

1. **Private Key Management**
   - Use hardware wallets for mainnet deployments
   - Never commit private keys to version control
   - Use environment variables for sensitive data

2. **Contract Verification**
   - Verify source code on block explorer
   - Publish ABI for public interaction
   - Document all contract methods

3. **Testing**
   - Deploy to testnet first
   - Run comprehensive integration tests
   - Simulate various market scenarios

4. **Monitoring**
   - Set up contract event monitoring
   - Track gas usage and costs
   - Monitor for unusual activity

## Upgrade Strategy

Since contracts are immutable on Bitcoin:
- Use governance for parameter updates
- Deploy new versions if major changes needed
- Migrate state through governance proposals
- Maintain backwards compatibility when possible

## Support

For deployment issues:
- Check OPNet documentation
- Contact support team
- Join Discord for community help
