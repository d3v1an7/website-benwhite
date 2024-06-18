# Credit: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
# Assumes `./public/icon.svg` exists
# Assumes deps installed: `brew install inkscape imagemagick oxipng`
inkscape ./public/icon.svg --export-width=16 --export-type="png" --export-filename="./public/tmp-favicon-16.png"
inkscape ./public/icon.svg  --export-width=32 --export-type="png" --export-filename="./public/tmp-favicon-32.png"
inkscape ./public/icon.svg --export-width=192 --export-type="png" --export-filename="./public/icon-192.png"
inkscape ./public/icon.svg --export-width=512 --export-type="png" --export-filename="./public/icon-512.png"
oxipng --opt max ./public/tmp-favicon-16.png
oxipng --opt max ./public/tmp-favicon-32.png
oxipng --opt max ./public/icon-192.png
oxipng --opt max ./public/icon-512.png
magick ./public/tmp-favicon-16.png ./public/tmp-favicon-32.png ./public/favicon.ico
magick ./public/icon-512.png -resize 140x140 -gravity center -background none -extent 180x180 ./public/apple-touch-icon.png
npx svgo --multipass ./public/icon.svg
rm ./public/tmp-favicon-32.png ./public/tmp-favicon-16.png
