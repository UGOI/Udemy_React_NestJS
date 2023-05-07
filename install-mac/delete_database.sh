#!/bin/bash

# Load .env file
set -a
source ../.env
set +a

# Check if database exists
echo "Checking if database '$DB_DATABASE' exists..."
DB_EXISTS=$(mysql -u $DB_USERNAME -p$DB_PASSWORD -e "SHOW DATABASES LIKE '$DB_DATABASE';" | grep "$DB_DATABASE" > /dev/null; echo "$?")

if [ "$DB_EXISTS" -eq 1 ]; then
    echo "Database '$DB_DATABASE' doesn't exist. Nothing to delete."
else
    echo "Deleting database '$DB_DATABASE'..."
    mysql -u $DB_USERNAME -p$DB_PASSWORD -e "DROP DATABASE $DB_DATABASE;"
    echo "Database '$DB_DATABASE' deleted."
fi
