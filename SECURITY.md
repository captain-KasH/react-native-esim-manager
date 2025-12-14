# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately:

1. **Do not** open a public GitHub issue
2. Email: [security contact email]
3. Include detailed description and steps to reproduce
4. Allow 48 hours for initial response

## Security Considerations

### Permissions
- Android: READ_PHONE_STATE permission required
- iOS: No additional permissions needed

### Data Handling
- No sensitive data is stored locally
- eSIM activation codes should be handled securely
- ICCID and carrier information may be sensitive

### Best Practices
- Validate activation codes before installation
- Handle permission denials gracefully
- Use secure communication channels for eSIM provisioning