# fyl
Bare-bone(and aspiring) file uploader - Not a competition to XHR file uploaders, out there in the wild :)

### Usage
```javascript
fyl({
    data: {
        user: 'fyl-user',
        /** ...*/ 
    },
    allowsOnly: [
        'image/*', //file extensions starting with the STOP character, e.g: .gif, .jpg, .png, .doc, 
                  // audio/*, video/*, image/*, media_type
    ],
    url: '/fylupload', // Upload URL
    fileName: 'flywithfyl', // Filename
    fileNameNoIndexOnOne: true, // 
    trigger: 'change', // AJAX upload trigger
    /**
    * Callbacks ...
    * */
    cbProgress: function(e){
        if (e.lengthComputable) {
            var percentComplete = (e.loaded / e.total) * 100;
                console.log(percentComplete + '% uploaded');
        }
    },
    cbDone: function(res){
        console.log('Thanks for your contribution to the cloud!');
    },
    cbErr: function(err) {
        console.log(err);
    }
});

```


#### Note
Libraries were used, but as a development aid (concatenation, es6 -> es5, etc..)
