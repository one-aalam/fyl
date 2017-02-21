import extend from './utils/extend'
import upload from './utils/upload'
/**
 * Guts of `fyl`
 * attaches upload magic to file inputs
 *
 */
const _defaults = {
    'uploaderCls': 'fyl-upload',
    'previewCls': 'fyl-preview',
    'previewImage': false,
    'allowsOnly': [],
    'trigger': 'change', // Not exposed to public API
    cbDone: (res) => {
        console.log('Fyl got this as response ->', res);
    },
    cbErr: (err) => {
        console.log('Fyl faced an error! ->', err);
    },
    cbProgress: function(e){
        if (e.lengthComputable) {
            var percentComplete = (e.loaded / e.total) * 100;
            console.log(percentComplete + '% uploaded (Fyl)');
        }
    }
}

const fyl = (options) => {
   //
   var _options = extend(_defaults, options);
    // initialize return array
   var preview = document.querySelector('.' + _options.previewCls);
   // Iterate over all elements
   document.querySelectorAll('.' + _options.uploaderCls).forEach(($elm) => {
       let $parentElm   = $elm.parentElement;

       let $fylFauxElm  = $parentElm.querySelector('.fyl-faux-upload');
       let $fylStats    = $parentElm.querySelector('.fyl-status');
       let $fylPreview  = $parentElm.querySelector('.fyl-preview');
       // File restriction
       restrictByType(_options.allowsOnly, $elm);
       //
       $elm.addEventListener('change', (e) => {
            if(e.target.files.length){
                let _files = e.target.files;
                let _data = { fields: options.data || {}, files: {}};

                if($fylPreview) $fylPreview.innerHTML = '';
                for(let i = 0; i < _files.length; i++ ){
                    // Generate previews (if applicable)
                    if(_options.previewImage && $fylPreview){
                        genPreview(_files[i], $fylPreview);
                    }
                    // Prepare selected file for upload
                    _data.files[iFileName( _options.fileName || $elm.name || $elm.id, i )] = _files[i];
                }

                //
                if($fylStats){
                    $fylStats.innerHTML = genSummary(_files);
                }

                // Clean-up index agianst custom filename if just one file is uploaded
                if(1 === _files.length && _options.fileNameNoIndexOnOne){
                     let fileName = iFileName( _options.fileName || $elm.name || $elm.id ) ;
                    _data.files[fileName] = _data.files[iFileName(fileName, 0)];
                    delete _data.files[iFileName(fileName, 0)];
                }

                // Upload...
                if(_options.trigger && 'change' === _options.trigger){
                    upload({
                        url: options.url,
                        fields: _data.fields,
                        files: _data.files,
                        progress: _options.cbProgress
                    }).then(_options.cbDone, _options.cbErr);

                    // 
                    e.target.value = '';
                }
            }
       });

       // If faux elements available, use them instead...
       if($fylFauxElm){
           $elm.style.display = 'none';
           $fylFauxElm.addEventListener('click', (e) => {
                e.preventDefault();
                $elm.click();
                return false;
           }, false)
       }
   });
}

/**
 * Modify file input DOM to attach accept header
 * Allows only permissible files, as configured!
 */
const restrictByType = (allowsOnly, elm) => {
    if(allowsOnly.length){
        elm.accept = allowsOnly.join(',');
    }
}

const genImage = (imgFile) => {
    let img = document.createElement("img");
    img.classList.add("fyl-preview-img");
    return img;
}

const loadImg = (img, file) => {
    let reader = new FileReader();
    reader.onload = (function(asyncImg) { return function(e) { asyncImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
}

const genPreview = (file, preview) => {
    var imageType = /^image\//;
    if(imageType.test(file.type)){
        let img = genImage(file);
        preview.appendChild(img);
        loadImg(img, file)
    }
}

const genSummary = (files) => files.length ? (files.length <= 5 ? files.length : '5+') + ' selected' : '' ;

const iFileName = (fileName, i ) => fileName + (i !== undefined ? '_' + i : '') ;

module.exports = fyl;
