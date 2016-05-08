const utils = require('rsx-common');
const path = require('path');
const generator = require('yeoman-generator');
const chalk = utils.chalk;

module.exports = generator.Base.extend({
  constructor: function() {
    generator.Base.apply(this, arguments);
    this.argument('name', { type: String, required: true });

    this.option('package', {
      desc: 'Package name for the application (com.example.app)',
      type: String,
      defaults: 'com.rsx.' + this.name.toLowerCase()
    });
  },

  initializing: function() {
    if (!utils.validate.isPackageName(this.options.package)) {
      throw new Error('Package name ' + this.options.package + ' is not valid');
    }
  },

  writing: function() {
    const templateParams = {
      package: this.options.package,
      name: this.name
    };
    // SomeApp/ios/SomeApp
    this.fs.copyTpl(
      this.templatePath(path.join('app', '**')),
      this.destinationPath(path.join('ios', this.name)),
      templateParams
    );

    // SomeApp/ios/SomeAppTests
    this.fs.copyTpl(
      this.templatePath(path.join('tests', 'Tests.m')),
      this.destinationPath(path.join('ios', this.name + 'Tests', this.name + 'Tests.m')),
      templateParams
    );
    this.fs.copy(
      this.templatePath(path.join('tests', 'Info.plist')),
      this.destinationPath(path.join('ios', this.name + 'Tests', 'Info.plist'))
    );

    // SomeApp/ios/SomeApp.xcodeproj
    this.fs.copyTpl(
      this.templatePath(path.join('xcodeproj', 'project.pbxproj')),
      this.destinationPath(path.join('ios', this.name + '.xcodeproj', 'project.pbxproj')),
      templateParams
    );
    this.fs.copyTpl(
      this.templatePath(path.join('xcodeproj', 'xcshareddata', 'xcschemes', '_xcscheme')),
      this.destinationPath(path.join('ios', this.name + '.xcodeproj', 'xcshareddata', 'xcschemes', this.name + '.xcscheme')),
      templateParams
    );
  },

  end: function() {
    const projectPath = path.resolve(this.destinationRoot(), 'ios', this.name);
    this.log(chalk.white.bold('To run your app on iOS:'));
    this.log(chalk.white('   cd ' + this.destinationRoot()));
    this.log(chalk.white('   react-native run-ios'));
    this.log(chalk.white('   - or -'));
    this.log(chalk.white('   Open ' + projectPath + '.xcodeproj in Xcode'));
    this.log(chalk.white('   Hit the Run button'));
  }
});
