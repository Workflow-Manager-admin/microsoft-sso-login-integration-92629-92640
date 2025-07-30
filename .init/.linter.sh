#!/bin/bash
cd /home/kavia/workspace/code-generation/microsoft-sso-login-integration-92629-92640/backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

