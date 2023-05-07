#!/bin/bash

# Find and kill the NestJS application process
echo "Stopping NestJS application..."
NEST_APP_PID=$(ps aux | grep "[n]est start" | awk '{print $2}')
if [ -n "$NEST_APP_PID" ]; then
    kill $NEST_APP_PID
    echo "NestJS application stopped."
else
    echo "NestJS application not found."
fi

# Stop MySQL server
echo "Stopping MySQL server..."
brew services stop mysql
echo "MySQL server stopped."
