# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]: Create Account
    - generic [ref=e6]: Join ContentMultiplier.io and start creating amazing content
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]:
        - text: Email
        - generic [ref=e10]:
          - img [ref=e11]
          - textbox "Email" [active] [ref=e14]:
            - /placeholder: Enter your email
            - text: invalid-email
      - generic [ref=e15]:
        - text: Password
        - generic [ref=e16]:
          - img [ref=e17]
          - textbox "Password" [ref=e20]:
            - /placeholder: Create a password
      - generic [ref=e21]:
        - text: Confirm Password
        - generic [ref=e22]:
          - img [ref=e23]
          - textbox "Confirm Password" [ref=e26]:
            - /placeholder: Confirm your password
      - button "Create Account" [ref=e27]
    - paragraph [ref=e29]:
      - text: Already have an account?
      - link "Sign in" [ref=e30]:
        - /url: /login
```