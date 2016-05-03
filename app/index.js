'use strict';
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

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

    this.option('node', {
      type: Boolean,
      defaults: true,
      desc: 'Whether this is a node project (index.js, buynam) or pure client library'
    });

    this.option('git', {
      type: Boolean,
      defaults: true,
      desc: 'Whether the generator should initialise a Git repo for this project'
    });

    // Workaround a type coercion bug: https://github.com/yeoman/generator/issues/813
    this.options.git = this.options.git === true || this.options.git === 'true';
    this.options['private'] = this.options['private'] === true || this.options['private'] === 'true';
    this.options['node'] = this.options['node'] === true || this.options['node'] === 'true';
  },

  initializing: {
    git: function() {
      if (this.options.git === false) {
        return;
      }

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
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );

      this.fs.copy(
        this.templatePath('karma.conf.js'),
        this.destinationPath('karma.conf.js')
      );
    },

    constributing: function() {
      this.fs.copy(
        this.templatePath('CONTRIBUTING.md'),
        this.destinationPath('CONTRIBUTING.md')
      );
    },

    packageJSON: function() {
      this.log('Generating a', this.options['private'] ? 'private' : 'public', 'NPM module');

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          appName: this.appname,
          isNodeModule: this.options['node'],
          isPrivateModule: this.options['private']
        }
      );
    },

    git: function() {
      if (this.options.git === false) {
        return;
      }

      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore'));

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes'));
    },

    editorConfig: function() {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    npmIgnore: function() {
      this.fs.copy(
        this.templatePath('npmignore'),
        this.destinationPath('.npmignore')
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
      if (!this.options['node']) return;

      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath('index.js'),
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
      this.fs.copy(
        this.templatePath('tests'),
        this.destinationPath('tests')
      );
    },

    misc: function() {
      mkdirp('src');
    }
  },

  install: function() {
    this.npmInstall();
  }
});
