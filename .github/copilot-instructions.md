# Test Automation Pull Request Guidelines

This document establishes the code quality standards, naming conventions, and best practices for the Test Automation Framework. It is intended to be used by GitHub Copilot and human reviewers to ensure consistency, maintainability, and reliability across the codebase.

## 1. Naming Conventions

Strict adherence to naming conventions is required to maintain code readability.

### 1.1 Variables and Functions (`camelCase`)
* **Rule:** All variables (primitives, objects, arrays) and function names must use **camelCase**.
* **Context:** Function names should be verbs or verb phrases indicating the action performed.
* **Examples:**
    * ✅ `const userEmail = 'test@example.com';`
    * ✅ `async function clickSubmitButton() { ... }`
    * ✅ `const isVisible = await element.isDisplayed();`
    * ❌ `const User_Email = ...` (No Snake_Case or PascalCase)
    * ❌ `function Submit() { ... }` (No PascalCase for functions)

### 1.2 Classes, Interfaces, Types, and Instances (`PascalCase`)
* **Rule:** All Class definitions, Interface definitions, Type aliases, and **Class Instances** must use **PascalCase**.
* **Note on Instances:** Unlike standard conventions where instances are camelCase, this framework strictly requires **PascalCase** for instances to distinguish global page objects or singleton services.
* **Examples:**
    * ✅ `class LoginPage { ... }`
    * ✅ `interface UserData { ... }`
    * ✅ `type BrowserType = 'chrome' | 'firefox';`
    * ✅ `const LoginPageInstance = new LoginPage();`
    * ❌ `class loginPage { ... }`
    * ❌ `const loginPage = new LoginPage();` (Instance must be PascalCase)

## 2. Language and Documentation

### 2.1 English Only
* **Rule:** The entire codebase MUST be in **English**. This applies to:
    * Variable, function, and class names.
    * Inline comments.
    * JSDoc / Documentation blocks.
    * Commit messages and Pull Request descriptions.
    * Test data strings (unless testing localization specifically).
* **Reasoning:** Ensures global accessibility and consistency with standard programming keywords.

### 2.2 Documentation Standards
* **Rule:** All public methods in Page Objects and Helper classes must include JSDoc formatting explaining parameters and return types.
* **Example:**
    ```javascript
    /**
     * Navigates to the user profile page and updates the bio.
     * @param {string} bioText - The text to be inserted into the bio field.
     * @returns {Promise<void>}
     */
    async function updateProfileBio(bioText) { ... }
    ```

## 3. Automation Best Practices

### 3.1 Selectors Strategy
* **Priority:** Use robust selectors in the following order:
    1.  Testing IDs (`data-testid`, `data-cy`, `id`).
    2.  Accessibility labels (`aria-label`, text content).
    3.  CSS Selectors (avoiding long chains).
* **Forbidden:** DO NOT use absolute XPaths or brittle CSS chains (e.g., `div > div:nth-child(2) > span`).

### 3.2 Synchronization (Waits)
* **Rule:** Use **Explicit Waits** (waiting for a condition) over Implicit Waits.
* **Forbidden:** Hardcoded sleeps/pauses (e.g., `sleep(5000)`) are strictly forbidden unless absolutely necessary for debugging or external system latencies (must be commented with a valid reason).

### 3.3 Assertions
* **Rule:** Assertions must be clear and provide a meaningful error message if they fail.
* **Guideline:** Prefer generic assertion libraries (e.g., Chai, Jest, Playwright expect) logic over manual `if/throw` blocks.

## 4. Code Structure & Logic

### 4.1 Page Object Model (POM)
* Logic related to page interaction must be encapsulated within Page Objects.
* Test files (specs) should strictly contain test logic (Setup -> Action -> Assertion) and **not** raw selectors or implementation details.

### 4.2 DRY (Don't Repeat Yourself)
* If a workflow (e.g., login, API token generation) is used in more than two tests, it must be extracted into a helper function or a setup hook.

---

**Summary Checklist for Reviewer:**
- [ ] Are variables and functions `camelCase`?
- [ ] Are classes, types, interfaces, and instances `PascalCase`?
- [ ] Is everything written in English (no Spanish comments/names)?
- [ ] Are hardcoded waits (`sleep`) avoided?
- [ ] Are selectors robust (preferring IDs)?