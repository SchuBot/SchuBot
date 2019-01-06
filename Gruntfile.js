module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    // Load installer builder.
    grunt.loadNpmTasks('grunt-electron-installer');

};