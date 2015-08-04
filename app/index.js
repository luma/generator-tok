'use strict';
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var chalk = require('chalk');

function copyDir(fromPath, toPath, done) {
  fs.copy(fromPath, toPath, function(err) {
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
    this.appName = this.appName || 'Untitled';


    // add some flags
    this.option('private', {
      type: Boolean,
      defaults: true,
      desc: 'Whether this should be a private NPM project'
    });
  },

  _copyDir: function(fromPath, toPath) {
    copyDir(
      this.templatePath(fromPath),
      this.destinationPath(toPath),
      this.async()
    );
  },

  initializing: {
    git: function() {
      var done = this.async();

      this.log('\n\nInitializing Git repository. If this fails, try running ' +
               chalk.yellow.bold('git init') +
               ' and make a first commit manually');

      this.spawnCommand('git', ['init'])
        .on('error', done)
        .on('exit', function(err) {
          if (err === 127) {
            this.log('Could not find the ' + chalk.yellow.bold('git') + ' command. Make sure Git is installed on this machine');
            return;
          }

          this.log(chalk.green('complete') + ' Git repository has been setup');

          if (err !== 0) {
            this.log(chalk.red('Git exited with ' + err));
          }

          done();
        }.bind(this));
    }
  },

  writing: {
    gulpfile: function() {
      this._copyDir('gulpfile.js', 'gulpfile.js');
    },

    packageJSON: function() {
      this.log('Generating a', this.options['private'] ? 'private' : 'public', 'NPM module');

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          appName: this.appname,
          isPrivateModule: this.options['private']
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

    readme: function() {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        {
          appName: this.appname
        }
      );
    },

    app: function() {
      this.fs.copyTpl(
        this.templatePath('app.js'),
        this.destinationPath('app.js'),
        {
          appName: this.appname
        }
      );
    },

    license: function() {
      this.fs.copy(
        this.templatePath('LICENSE'),
        this.destinationPath('LICENSE')
      );
    },

    testing: function() {
      this._copyDir('tests', 'tests');
    },

    doc: function() {
      this.fs.copyTpl(
        this.templatePath('docs/config.json'),
        this.destinationPath('docs/config.json'),
        {
          appName: this.appname
        }
      );
    },

    misc: function() {
      mkdirp('src/js');
    }
  },

  install: function() {
    this.npmInstall();
  }
});
