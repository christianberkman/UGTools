/**
 * Presets
 */
const presets = [
    { name: "Custom", aspectRatio: 0, width: 1200, title: "Custom" },
    { name: "A4-p", aspectRatio: (210/297), width: 800, title: "A4 (Portrait)" },
    { name: "A4-l", aspectRatio: (297/210), width: 1200, title: "A4 (Landsapce)" },
    { name: "letter-p", aspectRatio: (85 / 110), width: 820, title: "Letter (Portrait)" },
    { name: "letter-l", aspectRatio: (110 / 85), width: 1100, title: "Letter (Landscape)" },
    { name: "photo-eu", aspectRatio: (35 / 45), width: 200, title: "Passport Photo (EU)" },
    { name: "photo-us", aspectRatio: 1, width: 200, title: "Passport Photo (US)" },
    { name: "pp-full", aspectRatio: (125 / 176), width: 500, title: "Passport (two pages)" },
    { name: "pp-half", aspectRatio: (125 / 88), width: 800, title: "Passport (single page)" }
]      
let activePreset = 0;

$( function(){
    /**
     * Preset Buttons
     */
    presets.forEach( (preset) => {           
        newBtn = $(".prototype").clone()
        newBtn.removeClass('prototype')
        newBtn.removeClass('d-none')
        newBtn.html(preset.title)
        newBtn.attr('data-preset', preset.name)
        newBtn.appendTo('#presetButtons')
        $('#presetButtons').append('\n')
    })
    
    /**
     * Image Upload
     */
    let fileName
    $('#fileInput').change( function(e){
        var $input = $(this);
        var inputFiles = this.files;
        if(inputFiles == undefined || inputFiles.length == 0) return;
        var inputFile = inputFiles[0];
        fileName = inputFile.name.replace(/\.[^/.]+$/, "")
        $('#fileName').val(fileName + '_250kb')
        
        var reader = new FileReader();
        reader.onload = function(event) {
            const fileData = event.target.result
            cropper.replace(fileData)
        };
        reader.onerror = function(event) {
            alert("I AM ERROR: " + event.target.error);
        };
        reader.readAsDataURL(inputFile);

        $('#btnDownload').removeClass('d-none')
    })

    /**
     * Filaneme change
     */
    $('#fileName').change( function(){
        fileName = $(this).val().toString()
    })

    /**
     * Rotate source
     */
    $('#btnRotateCW').click( () => { cropper.rotate(90) } )
    $('#btnRotateCCW').click( () => { cropper.rotate(-90) } )
    
    /**
     * Document Type Buttons
     */
    $('.preset').click( function(){
        $('.preset').removeClass('btn-primary')
        $('.preset').addClass('btn-outline-primary')

        $(this).removeClass('btn-outline-primary')
        $(this).addClass('btn-primary')

        const presetName = $(this).attr('data-preset')
        
        // Set preset
        setActivePreset(presetName)

        // Trigger form change
        const e = new Event('change')
        const form = document.querySelector('#form')
        form.dispatchEvent(e)
        return
    })

    /**
     * Set the active preset and update aspect ratio
     */
    function setActivePreset(presetName){
        // Set active preset      
        activePreset = presets.filter( d => d.name == presetName )[0] 

        // Set aspect ratio
        cropper.setAspectRatio(activePreset.aspectRatio)

        // Log
        console.log('Active preset: ' + activePreset.name)
        console.log(activePreset)
    }

    /**
     * Download Button
     */
    $('#btnDownload').click( () => {
        
        const dataUrl = fitToFileSize()       

        $('#btnDownload').attr('download', fileName + '.jpg')
        $('#btnDownload').attr('href', dataUrl)
    })

    /**
     * Cropper.JS
     */
    const cropCanvas = document.getElementById('cropCanvas')
    const cropper = new Cropper(cropCanvas, { 
        viewMode: 1,
        aspectRatio: null, 
        autoCrop: true, 
        autoCropArea: 1, 
        minContainerWidth: 10,  
        minCanvasWidth: 10,
        }
    )

    /**
     * Iterate to get maximum filesize
     * @return string dataUrl
     */
    function fitToFileSize(){
        let q
        let dataUrl
        let size_in_kb
    
        // Reduce quality from 1 to 0.1 in steps of 0.1 
        for(let i = 10; i > 0; i--){
            q = i / 10;
            dataUrl = cropper.getCroppedCanvas( { width: activePreset.width } ).toDataURL('image/jpeg', q); 
        
            // Calculate size of resulting file in kb
            var content_without_mime = dataUrl.split(",")[1];
            size_in_kb = Math.round( (window.atob(content_without_mime).length) / 1000 );
            
            // Stop if file size is less then 240kb (5kb tolerance as acueal size can be a few kb more)
            if(size_in_kb <= 245) break;
        }

        console.log('Resulting file ' + size_in_kb + 'kb, quality: ' + q)
        return dataUrl
    }
})
