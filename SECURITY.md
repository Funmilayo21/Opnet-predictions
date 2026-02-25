# Security Policy

## Reporting a Vulnerability

We take the security of OPNet Predictions seriously. If you discover a security vulnerability, please follow these guidelines:

### For Critical Security Issues

**DO NOT** create a public GitHub issue. Instead:

1. **Email**: security@opnetpredictions.com
2. **Subject**: "Security Vulnerability - [Brief Description]"
3. **Include**:
   - Detailed description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

### Response Timeline

- **24 hours**: Acknowledgment of receipt
- **7 days**: Initial assessment and response
- **30 days**: Fix development and deployment
- **90 days**: Public disclosure (coordinated)

### Bug Bounty Program

We offer rewards for security vulnerabilities:

| Severity | Description | Reward |
|----------|-------------|--------|
| Critical | Loss of funds, contract takeover | 10,000-50,000 PRED |
| High | Significant functionality compromise | 5,000-10,000 PRED |
| Medium | Potential security issue | 1,000-5,000 PRED |
| Low | Minor security concern | 100-1,000 PRED |

**Reward Criteria:**
- Original discovery
- Responsibly disclosed
- Includes detailed report
- Actionable fix possible

## Supported Versions

| Version | Supported | Status |
|---------|-----------|--------|
| 1.0.x   | ✅ Yes    | Current |
| < 1.0   | ❌ No     | Pre-release |

## Security Best Practices

### For Users

#### Wallet Security

1. **Use Hardware Wallets**
   - Never store large amounts in software wallets
   - Use Ledger or Trezor for PRED and BTC

2. **Protect Private Keys**
   - Never share your private keys
   - Never enter keys on suspicious websites
   - Use strong passwords and 2FA

3. **Verify Contract Addresses**
   - Always verify you're interacting with official contracts
   - Check addresses multiple times
   - Bookmark official links

4. **Start Small**
   - Test with small amounts first
   - Understand the platform before large bets
   - Don't risk more than you can afford to lose

5. **Check Approvals**
   - Review token approvals regularly
   - Revoke unused approvals
   - Only approve amounts you plan to use

#### Transaction Security

1. **Review Before Signing**
   - Read transaction details carefully
   - Verify amounts and addresses
   - Check gas fees are reasonable

2. **Avoid Phishing**
   - Only use official website
   - Check URL spelling carefully
   - Ignore unsolicited DMs

3. **Secure Your Environment**
   - Use updated antivirus software
   - Don't use public WiFi for transactions
   - Keep browser extensions minimal

### For Developers

#### Smart Contract Security

1. **Input Validation**
   ```typescript
   // Always validate inputs
   if (amount < MIN_AMOUNT) {
       throw new Error('Amount too low');
   }
   if (address == Address.dead()) {
       throw new Error('Invalid address');
   }
   ```

2. **Access Control**
   ```typescript
   // Check permissions
   if (sender != owner) {
       throw new Error('Unauthorized');
   }
   ```

3. **Safe Math**
   ```typescript
   // Use checked operations
   const result = u256.add(a, b); // Throws on overflow
   // Avoid: a + b (unchecked)
   ```

4. **Reentrancy Protection**
   ```typescript
   // Update state before external calls
   this.setUserClaimed(marketId, user, true);
   // Then transfer funds
   this.transferFunds(user, amount);
   ```

5. **Storage Collisions**
   ```typescript
   // Use unique namespaces
   const pointer = this.getStoragePointer('market', id, 'field');
   // Avoid: simple counters that could collide
   ```

#### Code Review Checklist

- [ ] Input validation on all public functions
- [ ] Access control checks
- [ ] Safe math operations (no overflow/underflow)
- [ ] Reentrancy protection
- [ ] Storage collision prevention
- [ ] Event emission for state changes
- [ ] Gas optimization
- [ ] Edge case handling
- [ ] Clear error messages
- [ ] Documentation complete

#### Testing Requirements

1. **Unit Tests**
   - Test each function independently
   - Test with valid inputs
   - Test with invalid inputs
   - Test boundary conditions

2. **Integration Tests**
   - Test contract interactions
   - Test multi-step workflows
   - Test with realistic scenarios

3. **Adversarial Tests**
   - Test with malicious inputs
   - Test race conditions
   - Test reentrancy attacks
   - Test overflow/underflow
   - Test unauthorized access

4. **Fuzzing**
   - Random input testing
   - Property-based testing
   - Invariant checking

## Known Security Considerations

### Current Security Measures

1. **Timelock on Governance**
   - 2-day delay before execution
   - Prevents rushed malicious proposals
   - Allows community to react

2. **Quorum Requirements**
   - 4% of supply must participate
   - Prevents low-participation attacks
   - Ensures community consensus

3. **Proposal Threshold**
   - 10,000 PRED required to propose
   - Prevents spam proposals
   - Requires skin in the game

4. **Early Withdrawal Penalties**
   - 10% penalty discourages gaming
   - Ensures committed stakers
   - Distributes to honest stakers

5. **Market Resolution Delays**
   - Time between end and resolution
   - Allows for data verification
   - Prevents rushed decisions

### Potential Attack Vectors

#### Market Manipulation

**Attack**: Create fake markets or manipulate odds
**Mitigation**:
- Market creation fees
- Resolver reputation (future)
- Community reporting
- Minimum bet sizes

#### Governance Attacks

**Attack**: Accumulate tokens to control protocol
**Mitigation**:
- Timelock delays
- Quorum requirements
- Public proposals
- Community monitoring

**Attack**: Bribe voters
**Mitigation**:
- Secret voting (future)
- Reputation system (future)
- Multi-sig treasury
- Transparent on-chain voting

#### Oracle Manipulation

**Attack**: Resolver reports false outcomes
**Mitigation**:
- Trusted resolver selection
- Dispute mechanism (future)
- Multi-oracle consensus (future)
- Community appeals

#### Front-Running

**Attack**: See pending bets and front-run
**Mitigation**:
- Commit-reveal scheme (future)
- Batch auctions (future)
- Time-weighted bets (future)

### Future Security Enhancements

1. **Formal Verification**
   - Mathematical proof of correctness
   - Verify critical properties
   - Catch edge cases

2. **Decentralized Oracles**
   - Multiple data sources
   - Consensus mechanism
   - Dispute resolution

3. **Circuit Breakers**
   - Pause functionality in emergencies
   - Rate limiting
   - Automatic anomaly detection

4. **Insurance Fund**
   - Covers losses from exploits
   - Community-funded
   - Governance-controlled

5. **Upgradeable Proxies**
   - Fix bugs without full redeployment
   - Timelock on upgrades
   - Governance approval required

## Audit History

### Planned Audits

1. **Internal Security Review**
   - Status: Completed
   - Date: February 2026
   - Findings: Documentation complete

2. **External Audit #1**
   - Auditor: TBD
   - Status: Pending
   - Scope: All smart contracts

3. **External Audit #2**
   - Auditor: TBD
   - Status: Pending
   - Scope: Critical functions

4. **Formal Verification**
   - Provider: TBD
   - Status: Planned
   - Scope: Core logic

### Audit Reports

Audit reports will be published here after completion:
- [Link to Audit #1]
- [Link to Audit #2]
- [Link to Formal Verification]

## Security Resources

### Documentation

- **Architecture**: ARCHITECTURE.md
- **Usage Guide**: USAGE.md
- **FAQ**: FAQ.md

### Tools

- **OPNet Docs**: https://docs.opnet.org
- **Bitcoin Security**: https://bitcoin.org/en/security
- **Smart Contract Best Practices**: https://consensys.github.io/smart-contract-best-practices/

### Community

- **Discord**: Security channel
- **Telegram**: Security discussion
- **Email**: security@opnetpredictions.com

## Incident Response Plan

### Detection

1. **Monitoring**
   - On-chain analytics
   - Event monitoring
   - Anomaly detection
   - Community reports

2. **Alerting**
   - Automated alerts
   - Community notifications
   - Emergency contacts

### Response

1. **Assessment** (0-1 hour)
   - Verify the issue
   - Assess severity
   - Identify affected components

2. **Containment** (1-4 hours)
   - Activate circuit breakers if needed
   - Pause affected functionality
   - Notify users

3. **Resolution** (4-48 hours)
   - Deploy fix via governance
   - Test thoroughly
   - Gradual rollout

4. **Communication** (Ongoing)
   - Transparent updates
   - Regular status reports
   - Post-mortem analysis

### Recovery

1. **Restoration**
   - Resume normal operations
   - Monitor closely
   - Compensate affected users if needed

2. **Post-Incident**
   - Detailed post-mortem
   - Identify root cause
   - Implement preventive measures
   - Update documentation

## Responsible Disclosure

We believe in transparency and responsible disclosure:

1. **Private Disclosure**: Report to us first
2. **Coordination**: Work with us on the fix
3. **Public Disclosure**: After fix is deployed (90 days)
4. **Recognition**: Credit in security advisories

### Hall of Fame

Security researchers who help protect OPNet Predictions:

- [Your name could be here!]

## Contact

- **Security Email**: security@opnetpredictions.com
- **PGP Key**: [Coming soon]
- **Discord**: #security channel
- **Emergency**: Use @security mention in Discord

---

**Remember**: Security is a shared responsibility. Stay vigilant, report issues, and help us build a secure platform for everyone.

**Last Updated**: February 2026
