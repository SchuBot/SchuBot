/* module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'create-windows-installer': {
            x64: {
                appDirectory: 'G:/GitHub/Firebot/dist/Firebot-win32-x64',
                outputDirectory: 'G:/GitHub/Firebot/dist/installer64',
                loadingGif: 'G:/GitHub/Firebot/gui/images/animated.gif',
                iconUrl: 'https://crowbartools.com/projects/firebot/logo.ico',
                setupIcon: 'G:/GitHub/Firebot/gui/images/logo.ico'
            }
        }
    });

    // Load installer builder.
    grunt.loadNpmTasks('grunt-electron-installer');

}; */


module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'create-windows-installer': {
            x64: {

                appDirectory: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/dist/SchuBot-win32-x64',
                outputDirectory: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/dist/installer64',
                loadingGif: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/gui/images/animated.gif',

                setupIcon: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/gui/images/logo.ico'
            }
        }
    });

    // Load installer builder.
    grunt.loadNpmTasks('grunt-electron-installer');

};