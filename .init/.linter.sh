#!/bin/bash
cd /tmp/kavia/workspace/code-generation/user-approval-system-747-758/social_media_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

