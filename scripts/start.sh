#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
PORT=5000
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-$PORT}"

start_service() {
    cd "${COZE_WORKSPACE_PATH}"
    echo "Starting HTTP service..."
    # Vercel 会通过 PORT 环境变量指定端口，不需要手动指定
    npx next start
}

echo "Starting HTTP service on port ${DEPLOY_RUN_PORT} for deploy..."
start_service
