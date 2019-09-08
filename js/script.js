$(function() {

    slider1 = new Slider({
        buttons: '.gallery-1 .button-action',
        stopBtn: '.gallery-1 .button-action[data-action="stop"]',
        autoNextBtn: '.gallery-1 .button-action[data-action="next-auto"]',
        autoPrevBtn: '.gallery-1 .button-action[data-action="prev-auto"]',
        images: '.gallery-1 .photos img',
        delayInput: '.gallery-1 .delay-input',
        show: 0
    });

    slider2 = new Slider({
        buttons: '.gallery-2 .button-action',
        stopBtn: '.gallery-2 .button-action[data-action="stop"]',
        autoNextBtn: '.gallery-2 .button-action[data-action="next-auto"]',
        autoPrevBtn: '.gallery-2 .button-action[data-action="prev-auto"]',
        images: '.gallery-2 .photos img',
        // delayInput: '.gallery-2 .delay-input',
        show: 0,
        rate: 3000,
        auto: true
    });

    slider3 = new Slider({
        buttons: '.gallery-3 .button-action',
        // stopBtn: '.gallery-3 .button-action[data-action="stop"]',
        // autoNextBtn: '.gallery-3 .button-action[data-action="next-auto"]',
        // autoPrevBtn: '.gallery-3 .button-action[data-action="prev-auto"]',
        images: '.gallery-3 .photos img',
        // delayInput: '.gallery-3 .delay-input',
        show: 2
    });
});



function Slider(options) {

    var slider = $(this);

    slider.buttons = $(options.buttons);
    slider.stopBtn = $(options.stopBtn);
    slider.autoNextBtn = $(options.autoNextBtn);
    slider.autoPrevBtn = $(options.autoPrevBtn);
    slider.images = $(options.images);
    slider.delayInput = $(options.delayInput);

    slider.i = options.show;
    slider.action = 'stop';
    slider.isRun = false;
    slider.isAuto = options.auto;

    if (isNaN(slider.delayInput.val())) {
        slider.delay = options.rate;
    } else {
        slider.delay = parseInt(slider.delayInput.val() * 1000);
    }

    slider.images.eq(slider.i).show();


    slider.prev = function(autoPrev, autoNext) {

        if (slider.action == 'stop') {
            slider.stop(autoPrev, autoNext);
            return;
        } else if (slider.action == 'autonext') {
            clearInterval(autoPrev);
            return;
        }

        slider.images.eq(slider.i).animate({
            left: '100%'
        }, 500);
        slider.i--;
        
        if(slider.i < 0){
            slider.i = slider.images.length - 1;
        }
        
        slider.images.eq(slider.i).css({
            display: 'block',
            left: '-100%'
        }).animate({
            left: 0
        }, 490, function(){
            slider.isRun = false;
        });
    };

    slider.next = function(autoPrev, autoNext) {

        if (slider.action == 'stop') {
            slider.stop(autoPrev, autoNext);
            return;
        } else if (slider.action == 'autoprev') {
            clearInterval(autoNext);
            return;
        }

        slider.images.eq(slider.i).animate({
            left: '-100%'
        }, 500);
        slider.i++;
        
        if(slider.i >= slider.images.length){
            slider.i = 0;
        }
        
        slider.images.eq(slider.i).css({
            display: 'block',
            left: '100%'
        }).animate({
            left: 0
        }, 490, function(){
            slider.isRun = false;
        });
    };

    slider.prevAuto = function(autoNext) {
        slider.prev(autoPrev);
        var autoPrev = setInterval(function() {slider.prev(autoPrev, autoNext);}, slider.delay);

        slider.buttonsDisable();
        slider.autoNextBtn.prop('disabled', false);
        slider.stopBtn.prop('disabled', false);
    };

    slider.nextAuto = function(autoPrev) {
        slider.next(autoNext);
        var autoNext = setInterval(function() {slider.next(autoPrev, autoNext);}, slider.delay);

        slider.buttonsDisable();
        slider.autoPrevBtn.prop('disabled', false);
        slider.stopBtn.prop('disabled', false);
    };

    slider.stop = function(autoPrev, autoNext) {
        clearInterval(autoPrev);
        clearInterval(autoNext);
        
        slider.buttonsEnable();
        slider.stopBtn.prop('disabled', true);
        slider.isRun = false;
    };

    slider.buttonsDisable = function() {
        slider.buttons.prop('disabled', true);
        slider.delayInput.prop('disabled', true);
    };

    slider.buttonsEnable = function() {
        slider.buttons.prop('disabled', false);
        slider.delayInput.prop('disabled', false);
    };
    
    if (slider.isAuto) {
        slider.action = 'autonext';
        slider.nextAuto();
    }

    slider.delayInput.on('change', function() {
        if (isNaN(slider.delayInput.val()) == true || slider.delayInput.val() < 1) {
            slider.delayInput.val(1);
        }
        slider.delay = parseInt(slider.delayInput.val() * 1000);
    });

    slider.buttons.on('click', function() {
        var buttonAction = $(this).attr('data-action');

        if (buttonAction == 'stop') {
            slider.action = 'stop';
        }

        if (slider.isRun) {
            return;
        }
        slider.isRun = true;

        if (buttonAction == 'prev') {
            slider.action = 'prev';
            slider.prev();

        } else if (buttonAction == 'next') {
            slider.action = 'next';
            slider.next();

        } else if (buttonAction == 'prev-auto') {
            slider.action = 'autoprev';
            slider.prevAuto();

        } else if (buttonAction == 'next-auto') {
            slider.action = 'autonext';
            slider.nextAuto();

        }
    });

}