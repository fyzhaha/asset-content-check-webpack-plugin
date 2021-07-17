const REPORT_WAY = {
  warnings: 'warnings',
  errors: 'errors',
  throwError: 'throwError'
}

module.exports = class AssetContentCheckWebpackPlugin {
  constructor(options) {
    this.options = processOptions(options)
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap("AssetContentCheckWebpackPlugin", (compilation) => {
      const TEST_FILE_ARR_LENGTH = this.options.testFileArr.length
      for (const [filename, asset] of Object.entries(compilation.assets)) {
        const source = asset.source();
        for (let i = 0; i < TEST_FILE_ARR_LENGTH; i++) {
          let { testFile, testContent, outTip } = { ...this.options.testFileArr[i] }
          if (!(testFile.test(filename))) {
            continue;
          }
          !testContent.test(source) ? this.handleError(compilation, filename, outTip) : ''
        }
      }
    });
  }

  handleError(compilation, filename, outTip) {
    const reportWay = REPORT_WAY[this.options.showErrorWay]
    if (reportWay === 'throwError') {
      throw new Error(`${filename}:${outTip}`)
    } else {
      compilation[reportWay].push(`${filename}:${outTip}`)
    }
  }
}


const processOptions = function (options) {

  if (!options || !options.testFileArr) {
    throw new Error('[AssetContentCheckWebpackPlugin] requires an object with {testFileArr, showErrorWay} properties')
  }

  options.testFileArr = Array.isArray(options.testFileArr) ? options.testFileArr : [options.testFileArr]

  options.testFileArr.forEach(function (item) {
    let { testFile, testContent, outTip } = { ...item }
    if (!testFile || !testContent || !outTip) {
      throw new Error('[AssetContentCheckWebpackPlugin] requires {testFile, testContent, outTip } properties for each check object.');
    }

    if (!(testFile instanceof RegExp)) {
      throw new Error('[AssetContentCheckWebpackPlugin] Configuration Error: {testFile} property expected to be a RegExp. Got: ' + testFile);
    }

    if (!(testContent instanceof RegExp)) {
      throw new Error('[AssetContentCheckWebpackPlugin] Configuration Error: {testContent} property expected to be a RegExp. Got: ' + testContent);
    }
  })

  if (!options.showErrorWay || !(options.showErrorWay in REPORT_WAY)) {
    options.showErrorWay = 'errors'
  }

  return options
}