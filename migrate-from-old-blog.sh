#! /bin/bash

for file in ????-??-??-*.md; do
    [ -e "$file" ] || continue

    year=${file:0:4}
    month=${file:5:2}
    day=${file:8:2}
    title=${file:11}

    mkdir -p "$year/$month/$day"

    mv "$file" "$year/$month/$day/$title"

    echo "moved $file → $year/$month/$day/$title"
done
