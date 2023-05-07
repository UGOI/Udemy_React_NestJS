#!/bin/bash

# Install MySQL if not already installed
if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed. Installing it using Homebrew..."
    brew install mysql
    echo "MySQL installed."
fi

# Start MySQL server
echo "Starting MySQL server..."
brew services start mysql

# Wait for MySQL server to be ready
echo "Waiting for MySQL server to be ready..."
while ! mysqladmin ping -h "$DB_HOST" --silent; do
    sleep 1
done
echo "MySQL server is ready."

# Change the root password
mysql -u root -e "ALTER USER 'root'@'$DB_HOST' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD'; FLUSH PRIVILEGES;"


# Load .env file
set -a
source ../.env
set +a

# Create the database if it doesn't exist
echo "Checking if database '$DB_DATABASE' exists..."
DB_EXISTS=$(mysql -u $DB_USERNAME -p$DB_PASSWORD -e "SHOW DATABASES LIKE '$DB_DATABASE';" | grep "$DB_DATABASE" > /dev/null; echo "$?")
if [ "$DB_EXISTS" -eq 1 ]; then
    echo "Database '$DB_DATABASE' doesn't exist. Creating it..."
    mysql -u $DB_USERNAME -p$DB_PASSWORD -e "CREATE DATABASE $DB_DATABASE;"
    echo "Database '$DB_DATABASE' created."
else
    echo "Database '$DB_DATABASE' already exists."
fi

# Run NestJS application
echo "Starting NestJS application..."
cd ..
npm run start
