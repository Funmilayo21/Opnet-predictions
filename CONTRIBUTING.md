# Contributing to OPNet Predictions

Thank you for your interest in contributing to OPNet Predictions! This document provides guidelines for contributing to the project.

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title**: Describe the bug concisely
2. **Description**: Detailed explanation of the issue
3. **Steps to reproduce**: How to trigger the bug
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Environment**: OS, Node version, etc.
7. **Screenshots**: If applicable

**Bug Report Template:**

```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: [e.g., Ubuntu 22.04]
- Node.js: [e.g., v18.0.0]
- Contract Version: [e.g., v1.0.0]

## Additional Context
[Any other relevant information]
```

### Suggesting Enhancements

Enhancement suggestions are welcome! Please create an issue with:

1. **Clear title**: Describe the enhancement
2. **Use case**: Why is this enhancement needed?
3. **Proposed solution**: How should it work?
4. **Alternatives**: Other approaches considered
5. **Additional context**: Examples, mockups, etc.

**Enhancement Template:**

```markdown
## Enhancement Description
[Clear description of the proposed feature]

## Use Case
[Why is this needed? What problem does it solve?]

## Proposed Solution
[How should this feature work?]

## Alternatives Considered
[Other approaches you've thought about]

## Additional Context
[Any other relevant information, mockups, examples]
```

### Pull Requests

#### Before Submitting

1. **Search existing PRs**: Avoid duplicates
2. **Discuss major changes**: Open an issue first
3. **Read documentation**: Understand the codebase
4. **Test locally**: Ensure everything works

#### Submission Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Opnet-predictions.git
   cd Opnet-predictions
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Add/update tests if needed
   - Update documentation
   - Keep commits atomic and well-described

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature" # or "fix: resolve bug"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Use the PR template
   - Link related issues
   - Describe changes thoroughly
   - Request reviews

#### PR Template

```markdown
## Description
[Describe your changes]

## Related Issues
Fixes #[issue number]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged

## Screenshots (if applicable)
[Add screenshots to demonstrate the changes]
```

## Development Guidelines

### Code Style

#### TypeScript/AssemblyScript

- Use TypeScript for infrastructure code
- Use AssemblyScript for smart contracts
- Follow existing code patterns
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic

**Example:**
```typescript
// Good
function calculateWinnings(betAmount: u256, totalPool: u256, winningPool: u256): u256 {
    // Calculate proportional share: (betAmount / winningPool) * totalPool
    const proportionalShare = u256.div(u256.mul(betAmount, totalPool), winningPool);
    
    // Deduct protocol fee (2%)
    const fee = u256.div(u256.mul(proportionalShare, u256.fromU32(200)), u256.fromU64(10000));
    
    return u256.sub(proportionalShare, fee);
}

// Bad
function calc(a: u256, b: u256, c: u256): u256 {
    const x = u256.div(u256.mul(a, b), c);
    return u256.sub(x, u256.div(u256.mul(x, u256.fromU32(200)), u256.fromU64(10000)));
}
```

#### Naming Conventions

- **Functions**: camelCase (`createMarket`, `placeBet`)
- **Classes**: PascalCase (`PredictionMarket`, `StakingContract`)
- **Constants**: UPPER_SNAKE_CASE (`MIN_BET`, `PROTOCOL_FEE_BPS`)
- **Private methods**: prefix with underscore (`_setU256`, `_getStoragePointer`)

#### Documentation

- Add JSDoc comments for public functions
- Explain parameters and return values
- Document complex algorithms
- Keep comments up to date

**Example:**
```typescript
/**
 * Create a new prediction market
 * @param question - The question/event to predict
 * @param description - Detailed description and resolution criteria
 * @param endTime - Unix timestamp when betting closes
 * @param resolutionTime - Unix timestamp when market can be resolved
 * @param resolver - Address authorized to resolve the market
 * @returns Market ID (u256)
 */
public createMarket(
    question: string,
    description: string,
    endTime: u256,
    resolutionTime: u256,
    resolver: Address
): u256 {
    // Implementation
}
```

### Testing

- Write tests for new features
- Ensure existing tests still pass
- Test edge cases
- Test error conditions

### Security

- **No private keys in code**: Ever
- **Validate all inputs**: Check bounds, types, permissions
- **Handle errors gracefully**: Don't expose sensitive info
- **Use safe math**: Prevent overflows/underflows
- **Review storage patterns**: Ensure no collisions
- **Test thoroughly**: Include malicious scenarios

### Git Workflow

#### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(market): add market cancellation feature
fix(staking): resolve early withdrawal penalty calculation
docs(readme): update installation instructions
refactor(governance): simplify vote counting logic
```

#### Branch Naming

- `feature/description`: New features
- `fix/description`: Bug fixes
- `docs/description`: Documentation
- `refactor/description`: Code refactoring

**Examples:**
```
feature/add-market-templates
fix/staking-reward-calculation
docs/update-usage-guide
refactor/optimize-storage-access
```

## Review Process

### For Contributors

1. **Be responsive**: Address review comments promptly
2. **Be open**: Accept feedback constructively
3. **Be thorough**: Explain your decisions
4. **Be patient**: Reviews take time

### For Reviewers

1. **Be respectful**: Provide constructive feedback
2. **Be specific**: Point to exact issues
3. **Be helpful**: Suggest solutions
4. **Be timely**: Review promptly

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Changes are well-documented
- [ ] Tests are included and passing
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] Breaking changes are justified
- [ ] Documentation is updated

## Community

### Where to Ask Questions

- **GitHub Discussions**: General questions
- **Discord**: Real-time chat
- **Telegram**: Community discussion
- **Email**: For private matters

### Getting Help

If you're stuck:

1. Check existing documentation
2. Search GitHub issues
3. Ask in Discord/Telegram
4. Create a GitHub discussion
5. Reach out to maintainers

## Recognition

Contributors will be recognized:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- NFT badges for significant contributions
- Governance voting rights

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing, feel free to:
- Open a GitHub Discussion
- Join our Discord
- Email: dev@opnetpredictions.com

---

**Thank you for contributing to OPNet Predictions! 🎉**

Together we're building the future of decentralized prediction markets on Bitcoin.
