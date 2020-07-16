#!/bin/sh

BuildFolder="./build"

set -e

if [ ! -d "$BuildFolder" ]; then
    echo "$BuildFolder folder doesn't exist"
    exit 1
fi

cd $BuildFolder

git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1
git init
git remote add --fetch origin "$REMOTE"
git add -A
git commit --allow-empty -m "Circle CI Deploy"
git push --force --quiet origin master

rm -rf "$BuildFolder"

echo "Deployed"