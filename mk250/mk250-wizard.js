/**
 * Wizard
 */
const wizard = {
    steps: [
        {
            container: '#stepIntro',
            validate: () => { return true }
        },
        {
            container: '#stepFile',
            validate: () => {
                var inputFiles = $('#fileInput')
                return (inputFiles.val().length > 0)
            }
        },
        {
            container: '#stepType',
            validate: () => { return !(activePreset == 0) }
        },
        {
            container: '#stepCrop',
            validate: () => { return true }
        },
        {
            container: '#stepDownload',
            validate: () => { return true }
        }
    ],
    
    index: 0,
    hasPrevStep: function(){ return (this.index > 0)},
    prevSep: function(){
        if(this.index > 0){ this.index--; return true; }
        else return false;
    },
    currentStep: function(){ return this.steps[this.index] },
    hasNextStep: function(){ return (this.index+1 < this.steps.length)},
    nextStep: function(){ 
        if(this.index+1 < this.steps.length) { this.index++; return true; }
        else return false;
    }

}

const btnPrev = $('#btnPrev')
    btnPrev.enable = function(){ this.prop('disabled', false) }
    btnPrev.disable = function() { this.prop('disabled', true) }
const btnNext = $('#btnNext')
    btnNext.enable = function(a){ this.prop('disabled', false) }
    btnNext.disable = function() { this.prop('disabled', true) }
const form = $('#form')

/**
 * Form ready
 */
form.ready( () => {
    console.log('form ready')
    if( wizard.hasNextStep() && wizard.currentStep().validate() ) btnNext.enable();
})

/**
 * Form change
 */
form.change( () => {
    console.log('form change, validate is ' + wizard.currentStep().validate())
    
    if( wizard.hasNextStep() && wizard.currentStep().validate() ) btnNext.enable()
    else btnNext.disable()
})

/**
 * Next button
 */
btnNext.click( function(){
    if( wizard.hasNextStep() && wizard.currentStep().validate() ){
        $('.step').addClass('visually-hidden')
        wizard.nextStep()
        $( wizard.currentStep().container ).removeClass('visually-hidden')
        window.scrollTo(0,0)
    }

    if( wizard.hasPrevStep() ) btnPrev.enable()
    else btnPrev.disable()
    if( wizard.hasNextStep() && wizard.currentStep().validate() ) btnNext.enable('click')
    else btnNext.disable()

})

/**
 * Prev Button
 */
btnPrev.click( function() {
    if( wizard.hasPrevStep() ){
        $('.step').addClass('visually-hidden')
        wizard.prevStep()
        $( wizard.currentStep().container).removeClass('visually-hidden')
        window.scrollTo(0,0)
    }

    if( wizard.hasPrevStep() ) btnPrev.enable()
    else btnPrev.disable()
    if( wizard.hasNextStep() && wizard.currentStep().validate() ) btnNext.enable('click')
    else btnNext.disable()
})