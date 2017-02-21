const upload = (options) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    return new Promise((resolve, reject) => {
        if(!options.url){
            reject(new Error('POST URL not provided'));
        }
        // usual form fields
        if(options.fields){
            decorateFormData(formData, options.fields);
        }
        if(options.files){
            decorateFormData(formData, options.files);
        }
        xhr.open('POST', options.url, true);
        xhr.onreadystatechange = () => {
            if(xhr.status === XMLHttpRequest.DONE && xhr.status === 200){
                resolve(xhr.responseText);
            }
        }
        // Progress
        xhr.upload.onprogress = options.cbProgress && typeof options.cbProgress === 'function' ? options.cbProgress : function(){};
        // Error
        xhr.onerror = (err) => {
            reject(err);
        }
        xhr.send(formData);
    });
}

const decorateFormData = (formData, fields) => {
    for(let field in fields){
        formData.append(field, fields[field]);
    }
    return formData;
}

export default upload;