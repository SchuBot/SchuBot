// "pack:win32": "electron-packager . ShoeBot --out=./dist --platform=win32 --arch=ia32 --electronVersion=3.0.10 --asar --prune --overwrite --icon=./gui/images/logo.ico --ignore=/user-settings --ignore=/kbm-java --ignore=/.vscode",
// "pack:win64": "electron-packager . ShoeBot --out=./dist --platform=win32 --arch=x64 --electronVersion=3.0.10 --asar --prune --overwrite --version-string.ProductName=\"ShoeBot\" --icon=./gui/images/logo.ico --ignore=/user-settings --ignore=/resources --ignore=/.vscode",
// "build32": "npm run pack:win32",
// "build64": "npm run pack:win64",
// "build-all": "echo Packaging 32bit versions && npm run rebuild32 && npm run pack:all32 && echo 32bit Packaging done.... && echo Packaging 64bit versions && npm run rebuild64 && npm run pack:all64",
// "rebuild": "npm run rebuild64",
// "build": "npm run build64",
// "package": "echo Building Electron package && npm run pack:win64 && echo Packing the installer && grunt create-windows-installer && echo Installer package ready!"


// "pack:win32": "electron-packager . Firebot --out=./dist --platform=win32 --arch=ia32 --electronVersion=1.7.10 --asar --prune --overwrite --icon=./gui/images/logo.ico --ignore=/user-settings --ignore=/kbm-java --ignore=/.vscode",
// "pack:win64": "electron-packager . Firebot --out=./dist --platform=win32 --arch=x64 --electronVersion=1.7.10 --asar --prune --overwrite --version-string.ProductName=\"Firebot\" --icon=./gui/images/logo.ico --ignore=/user-settings --ignore=/resources --ignore=/.vscode  && xcopy /s /i resources\\overlay .\\dist\\Firebot-win32-x64\\resources\\overlay && xcopy /s /i resources\\kbm-java .\\dist\\Firebot-win32-x64\\resources\\kbm-java && xcopy /s /i resources\\default-configs .\\dist\\Firebot-win32-x64\\resources\\default-configs && xcopy /s /i /Y resources\\ffmpeg .\\dist\\Firebot-win32-x64\\resources\\ffmpeg",
// "pack:mac": "electron-packager . Firebot --out=./dist --platform=darwin --arch=x64 --electronVersion=1.7.10 --asar --prune --overwrite --version-string.ProductName=\"Firebot\" --icon=./gui/images/logo.icns --ignore=/user-settings --ignore=/resources --ignore=/.vscode && mkdir -p ./dist/Firebot-darwin-x64/resources/overlay && cp -a ./resources/overlay/. ./dist/Firebot-darwin-x64/resources/overlay/ && mkdir -p ./dist/Firebot-darwin-x64/resources/kbm-java && cp -a ./resources/kbm-java/. ./dist/Firebot-darwin-x64/resources/kbm-java/",