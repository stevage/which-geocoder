echo "Rebuilding..."
./build.sh
echo "Re-deploying from build/"
cd build/
if [[ `git branch | head -n 1` != '* gh-pages' ]]; then 
    echo "The build directory should be symlinked to a gh-pages repository. Exiting."
    cd ..
    exit 1
fi
git commit -am 'Update.'
git push
cd ..