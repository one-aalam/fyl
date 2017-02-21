(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("fyl", [], factory);
	else if(typeof exports === 'object')
		exports["fyl"] = factory();
	else
		root["fyl"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extend = __webpack_require__(1);

var _extend2 = _interopRequireDefault(_extend);

var _upload = __webpack_require__(2);

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Guts of `fyl`
 * attaches upload magic to file inputs
 *
 */
var _defaults = {
    'uploaderCls': 'fyl-upload',
    'previewCls': 'fyl-preview',
    'allowsOnly': [],
    cbDone: function cbDone(res) {
        console.log('Fyl got this as response ->', res);
    },
    cbErr: function cbErr(err) {
        console.log('Fyl faced an error! ->', err);
    },
    cbProgress: function cbProgress(e) {
        if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total * 100;
            console.log(percentComplete + '% uploaded (Fyl)');
        }
    }
};

var fyl = function fyl(options) {
    //
    var _options = (0, _extend2.default)(_defaults, options);
    // initialize return array
    var preview = document.querySelector('.' + _options.previewCls);
    // Iterate over all elements
    document.querySelectorAll('.' + _options.uploaderCls).forEach(function ($elm) {
        // File restriction
        restrictByType(_options.allowsOnly, $elm);
        //
        $elm.addEventListener('change', function (e) {
            if (e.target.files.length) {
                var _files = e.target.files;
                var _data = { fields: options.data || {}, files: {} };
                preview.innerHTML = '';
                for (var i = 0; i < _files.length; i++) {
                    // Generate previews (if applicable)
                    genPreview(_files[i], preview);
                    // Prepare selected file for upload
                    _data.files[iFileName(_options.fileName || $elm.name || $elm.id, i)] = _files[i];
                }

                // Clean-up index agianst custom filename if just one file is uploaded
                if (1 === _files.length && _options.fileNameNoIndexOnOne) {
                    var fileName = iFileName(_options.fileName || $elm.name || $elm.id);
                    _data.files[fileName] = _data.files[iFileName(fileName, 0)];
                    delete _data.files[iFileName(fileName, 0)];
                }

                // Upload...
                if (_options.trigger && 'change' === _options.trigger) {
                    (0, _upload2.default)({
                        url: options.url,
                        fields: _data.fields,
                        files: _data.files,
                        progress: _options.cbProgress
                    }).then(_options.cbDone, _options.cbErr);
                    e.target.value = '';
                }
            }
        });
    });
};

/**
 * Modify file input DOM to attach accept header
 * Allows only permissible files, as configured!
 */
var restrictByType = function restrictByType(allowsOnly, elm) {
    if (allowsOnly.length) {
        elm.accept = allowsOnly.join(',');
    }
};

var genImage = function genImage(imgFile) {
    var img = document.createElement("img");
    img.classList.add("fyl-preview-img");
    return img;
};

var loadImg = function loadImg(img, file) {
    var reader = new FileReader();
    reader.onload = function (asyncImg) {
        return function (e) {
            asyncImg.src = e.target.result;
        };
    }(img);
    reader.readAsDataURL(file);
};

var genPreview = function genPreview(file, preview) {
    var imageType = /^image\//;
    if (imageType.test(file.type)) {
        var img = genImage(file);
        preview.appendChild(img);
        loadImg(img, file);
    }
};

var iFileName = function iFileName(fileName, i) {
    return fileName + (i !== undefined ? '_' + i : '');
};

module.exports = fyl;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var extend = function extend() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var extended = {};
    for (var key in args) {
        var argument = args[key];
        for (var prop in argument) {
            if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                extended[prop] = argument[prop];
            }
        }
    }
    return extended;
};

exports.default = extend;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var upload = function upload(options) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    return new Promise(function (resolve, reject) {
        if (!options.url) {
            reject(new Error('POST URL not provided'));
        }
        // usual form fields
        if (options.fields) {
            decorateFormData(formData, options.fields);
        }
        if (options.files) {
            decorateFormData(formData, options.files);
        }
        xhr.open('POST', options.url, true);
        xhr.onreadystatechange = function () {
            if (xhr.status === XMLHttpRequest.DONE && xhr.status === 200) {
                resolve(xhr.responseText);
            }
        };
        // Progress
        xhr.upload.onprogress = options.cbProgress && typeof options.cbProgress === 'function' ? options.cbProgress : function () {};
        // Error
        xhr.onerror = function (err) {
            reject(err);
        };
        xhr.send(formData);
    });
};

var decorateFormData = function decorateFormData(formData, fields) {
    for (var field in fields) {
        formData.append(field, fields[field]);
    }
    return formData;
};

exports.default = upload;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fyl = __webpack_require__(0);

var _fyl2 = _interopRequireDefault(_fyl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Main library namespace to allow `extensions` in future
 */

module.exports = _fyl2.default;

/***/ })
/******/ ]);
});