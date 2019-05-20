module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'create-windows-installer': {
            /*             copy: {

                            task0: {
                                expand: true,
                                src: ['jsondbfiles/**'],
                                dest: 'app/'
                            },
                        }, */
            x64: {

                appDirectory: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/dist/SchuBot-win32-x64',
                outputDirectory: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/dist/installer64',
                loadingGif: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/gui/images/schubot.gif',
                certificateFile: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/schubot_signing_key.pfx',
                certificatePassword: 'schugyver23',
                setupIcon: 'C:/Users/Schuster/Documents/Visual Studio 2015/Projects/MixerBotV2/gui/images/logo.ico'
            }
        }
    });

    // Load installer builder.
    grunt.loadNpmTasks('grunt-electron-installer');

};