# generator-tok

This is a Yeoman generator for apps that follow the Tokbox style guidelines and best practises.

### Installation

Eventually I will push this to npm. But for you can install it using:

```
git clone https://github.com/luma/generator-tok.git
cd generator-tok
npm link
```

After that the `yo tok` generator should be available.

### Usage

```
mkdir appName
cd appName
yo tok appName
```

This will generate a private module by default. Use `yo tok appName --private=false` to generate a public project.

To see what tasks your new app has you can run `gulp help`.


### What does it do for me?

It will generate apps with the following:
* linting and code style checking via ESLint
* testing via Jasmine
* code coverage via istanbul
* code doc generation via JSDoc
* a default *empty* LICENSE file
* a default .editorconfig and .gitignore
* a blank app.js source
* a package.json file containing all the common essentials


### What it doesn't do (yet)

* anything involving Karma or Browserify, so it's not browser friendly yet
* it doesn't have strong guidelines for how you build your final package, except that you should use Gulp as your task system

### TODOs

* adding the ability to generate a browser app (Browserify and karma support)
* tests!
