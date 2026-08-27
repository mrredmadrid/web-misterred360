#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
#  MISTERRED360 · Publicación en VPS OVH
#  Uso:  ./deploy/deploy-vps.sh
#  Requiere rsync local y acceso SSH al VPS.
# ═══════════════════════════════════════════════════════════
set -e

SSH_USER="root"            # ← tu usuario del VPS
SSH_HOST="TU_IP_VPS"       # ← IP de tu VPS OVH
REMOTE_DIR="/var/www/misterred360"

echo "→ Compilando la web en local..."
npm run build

echo "→ Subiendo dist/ al servidor..."
rsync -avz --delete dist/ "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"

echo "→ Hecho. La web está publicada en https://misterred360.es"
