#!/bin/bash
set -e

echo "--- Updating System ---"
sudo yum update -y

echo "--- Installing Dependencies ---"
sudo yum install python3 git unzip -y

echo "--- Cleaning up previous installs ---"
sudo rm -rf backend
sudo rm -rf backend_temp
sudo rm -rf Sporting-Court-App-m-vil-VersionBaseSinFirebase

echo "--- Unzipping Backend ---"
unzip -o backend.zip -d backend_temp
# Move contents to a clean backend folder
mv backend_temp/backend backend
rm -rf backend_temp

echo "--- Setting up Backend ---"
cd backend
python3 -m venv venv
source venv/bin/activate
# Install from the inner backend folder
pip install -r backend/requirements.txt

echo "--- Starting Application ---"
# Kill any existing uvicorn process
sudo pkill uvicorn || true

# Go into the inner backend folder where main.py is
cd backend

# Start uvicorn using the venv from the parent directory
# We use nohup to keep it running after disconnect
nohup ../venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 > ../app.log 2>&1 &

echo "--- Deployment Complete! ---"
echo "Backend is running on port 8000"
