#!/usr/bin/env bash
# GitHub Pages 배포 — gh-pages 브랜치에 dist 를 푸시 (Actions 불필요)
# 사용: bash scripts/deploy-pages.sh   (main 에 커밋된 상태에서 실행 권장)
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build

cd dist
touch .nojekyll
git init -q -b gh-pages
git add -A
git -c user.name="deploy" -c user.email="deploy@local" commit -qm "deploy $(date +%Y-%m-%dT%H:%M:%S) from $(git -C .. rev-parse --short HEAD 2>/dev/null || echo local)"
git push -f "https://github.com/minsub0922/pixel-arcade-tycoon.git" gh-pages:gh-pages
cd ..
rm -rf dist/.git

echo "✔ https://minsub0922.github.io/pixel-arcade-tycoon/ (반영까지 ~1분)"
