# ⚙️ Cấu Hình Linter & CheckStyle Tự Động (ESLint, Prettier, Flake8 & Ruff)

> **Mục tiêu:** Cung cấp bộ cấu hình chuẩn hóa (CheckStyle Rules) để tích hợp vào VSCode/IDE và CI/CD Pipeline (GitHub Actions).

---

## 1. Cấu Hình ESLint Nghiêm Ngặt Cho TypeScript & React (`.eslintrc.json`)

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "prefer-const": "error"
  }
}
```

---

## 2. Cấu Hình Định Dạng Code Tự Động Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 3. Cấu Hình Linter Cho Backend Python (`pyproject.toml` hoặc `setup.cfg`)

Dành cho các dự án dùng FastAPI / Python:
```ini
[flake8]
max-line-length = 120
extend-ignore = E203, W503
exclude = .git, __pycache__, build, dist, .venv, venv

[tool.black]
line-length = 120
target-version = ['py311']
include = '\.pyi?$'

[tool.isort]
profile = "black"
line_length = 120
```

---

## 4. Hook Tự Động Chặn Lỗi Trước Khi Commit (Git Pre-commit Hook)

Cấu hình file `.husky/pre-commit` để đảm bảo code bẩn không bao giờ lên Git:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Đang chạy Linter & CheckStyle tự động..."
npm run lint
npm run test
```
