'use strict';
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');

function copyDir(toPath, fromPath, done) {
  fs.copy(toPath, fromPath, function(err) {
    if (err) {
      throw new Error(err);
    }

    done();
  });
}

module.exports = generators.Base.extend({
  constructor: function() {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    this.argument('appname', { type: String, required: true });
    // And you can then access it later on this way; e.g. CamelCased
    // this.appname = _.camelCase(this.appname);

    // add some flags
    this.option('public', {
      type: Boolean,
      defaults: false,
      desc: 'Whether this should be a public NPM project'
    });
  },

  writing: {
    gulpfile: function() {
      copyDir('gulpfile.js', 'gulpfile.js', this.async());
    },

    packageJSON: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          'public': this.options['public']
        }
      );
    },

    git: function() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore'));
    },

    editorConfig: function() {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    linting: function() {
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );

      this.fs.copy(
        this.templatePath('eslintignore'),
        this.destinationPath('.eslintignore')
      );
    },

    coverage: function() {
      this.fs.copy(
        this.templatePath('istanbul.yml'),
        this.destinationPath('.istanbul.yml')
      );
    },

    app: function() {
      this.fs.copy(
        this.templatePath('app.js'),
        this.destinationPath('app.js')
      );
    },

    testing: function() {
      copyDir('tests', 'tests', this.async());
    },

    jsdoc: function() {
      copyDir('jsdoc', 'jsdoc', this.async());
    },

    misc: function() {
      mkdirp('src/js');
    }
  }
});
