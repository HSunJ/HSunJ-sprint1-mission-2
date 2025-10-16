#!/bin/bash

# PM2 프로세스 시작 (프로덕션 모드)
pm2 start ecosystem.config.js --env production

pm2 logs
