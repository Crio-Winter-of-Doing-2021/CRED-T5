#!/bin/sh

## Enable NodeSource repository for nodejs 12 ##
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

## Update package manager ##
sudo apt-get update

## Install dependencies ##
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo apt-get install -y postgresql

## Start Database Server ##
sudo service postgresql start

## Database to be used for the application ##
db_name=

## Password to be set for the default user "postgres" ##
pass=

## DB Configurations ##
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$pass'"
sudo -u postgres psql -c "CREATE DATABASE $db_name;"
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" -d $db_name
sudo -u postgres psql -c "CREATE TABLE users(user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, first_name VARCHAR NOT NULL, last_name VARCHAR, email VARCHAR NOT NULL UNIQUE, password VARCHAR NOT NULL, coins INT NOT NULL DEFAULT 0);" -d $db_name
sudo -u postgres psql -c "CREATE TABLE cards(card_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, card_no CHAR(16) UNIQUE NOT NULL, expiry_date CHAR(5) NOT NULL, name_on_card VARCHAR NOT NULL, outstanding_amount INT NOT NULL DEFAULT 0, card_user_id UUID NOT NULL, FOREIGN KEY(card_user_id) REFERENCES users(user_id) ON DELETE CASCADE);" -d $db_name
sudo -u postgres psql -c "CREATE TABLE statements(statement_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, month INT NOT NULL, year INT NOT NULL, net_amount INT NOT NULL, due_date CHAR(10) NOT NULL, statement_card_id UUID NOT NULL, FOREIGN KEY(statement_card_id) REFERENCES cards(card_id) ON DELETE CASCADE);" -d $db_name
sudo -u postgres psql -c "CREATE TABLE transactions(transaction_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, amount INT NOT NULL, type CHAR(1) NOT NULL, merchant VARCHAR DEFAULT 'Others', category VARCHAR DEFAULT 'Miscellaneous', transaction_statement_id UUID NOT NULL, FOREIGN KEY(transaction_statement_id) REFERENCES statements(statement_id) ON DELETE CASCADE);" -d $db_name
sudo -u postgres psql -c "CREATE TABLE payments(payment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, amount INT NOT NULL, date CHAR(10) NOT NULL, coins_earned INT NOT NULL DEFAULT 0, payment_statement_id UUID NOT NULL, FOREIGN KEY(payment_statement_id) REFERENCES statements(statement_id) ON DELETE CASCADE);" -d $db_name
sudo -u postgres psql -c "CREATE TABLE reminders(reminder_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, reminder_time CHAR(8) NOT NULL, reminder_card_id UUID NOT NULL UNIQUE, FOREIGN KEY(reminder_card_id) REFERENCES cards(card_id) ON DELETE CASCADE);" -d $db_name
sudo -u postgres psql -c "CREATE TABLE rewards(reward_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, code VARCHAR NOT NULL, body VARCHAR NOT NULL, count_available INT NOT NULL DEFAULT 0, cost INT NOT NULL);" -d $db_name
sudo -u postgres psql -c "CREATE TABLE bought_rewards(bought_reward_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, buy_date CHAR(10) NOT NULL, reward_id UUID, user_id UUID, FOREIGN KEY(reward_id) REFERENCES rewards(reward_id) ON DELETE SET NULL, FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE SET NULL);" -d $db_name
