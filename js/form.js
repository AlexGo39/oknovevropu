$(function () {

    const phone = '+7 (999) 999-99-99';

    $('[data-name="phone"]').inputmask("mask", { "mask": phone, 'showMaskOnHover': false });

    $.validator.addMethod("PHONE", function(value, element, regexp) {
        return this.optional(element) || /\+\d{1} \(\d{3}\) \d{3}-\d{2}-\d{2}/g.test(value);
    }, "Введите корректный номер.");

    $('[data-modal]').on('click', function (e) {
        e.preventDefault();

        let templateName = $(this).data('modalName');

        openModal(templateName);
    });

    $('body').delegate('.modal__close', 'click', function (e) {
        closeModal();
    });

    let checkFilledInput = (formControl) => {
        let input = formControl.find('.form-control-element'),
            value = input.val();

        if(value.length > 0) {
            formControl.addClass('form-control--filled');
        }
        else {
            formControl.removeClass('form-control--filled');
        }
    };

    let filledInput = () => {
        let formInput = $('.form-control-element');

        formInput.on('keyup', function (e) {
            let input = $(this),
                formControl = input.parent(),
                value = input.val(),
                name = input.prop('name');

            checkFilledInput(formControl);
        });

        formInput.on('input', function (e) {
            let input = $(this),
                formControl = input.parent(),
                value = input.val();

            checkFilledInput(formControl);
        });

        formInput.each(function (k, v) {
            let input = $(v),
                formControl = input.parent(),
                value = input.val();

            checkFilledInput(formControl);
        });
    }

    filledInput();

    // Upload
    $('body').delegate('[data-name="upload"]', 'click', function (e) {
        e.preventDefault();

        $('.file-upload input[type="file"]').trigger('click');
    });

    $('body').delegate('[data-name="remove-photo"]', 'click', function (e) {
        e.preventDefault();

        let template = $(`#file-upload`).html(),
            compiledTemplate = Template7.compile(template),
            context = {},
            html = compiledTemplate(context);

        $('.file-upload-content').html(html);
    });

    $(document).delegate('.file-upload input[type="file"]', 'input', function (event) {
        event.preventDefault();

        if(event.target.type != 'file') return false;

        let fileName = event.target.files[0].name;
        let fileType = event.target.files[0].type.split('/')[1];
        let arrTypes = ['jpg,', 'jpeg', 'png', 'svg+xml'];

        if(arrTypes.includes(fileType)) {
            let reader = new FileReader();
            
            reader.onload = function() {
                let template = $(`#file-uploaded`).html(),
                    compiledTemplate = Template7.compile(template),
                    context = {
                        fileName: fileName,
                        userpic: reader.result
                    },
                    html = compiledTemplate(context);

                $('.file-upload-content').html(html);
            }

            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // Validate
    validateForms = () => {
        $('[data-name="validate"]').each(function (index, element) {
            $(element).validate({
                submitHandler: function(form) {
                    form = $(form);

                    let isModal = form.parent().prop('class') == 'modal__content' ? true: false;
                    let formUrl = form.prop('action');

                    let file_data = [],
                        file,
                        form_data = new FormData(form[0]);

                    // Если у нас есть файлы, загрузим их
                    $('input[type="file"]').each(function (k, v) {
                        file = $(v).prop('files')[0];
                        file_data.push(file);
                    });

                    for(let i = 0; i <= file_data.length; i++) {
                        form_data.append('files', file_data);
                    }

                    // Собираем параметры
                    form_data.append('params', form.serialize());

                    $.ajax({
                        url: formUrl,
                        dataType: 'json',
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: form_data,
                        type: 'post',
                        success: function(response) {
                            let template = isModal ? $(`#form-complete`).html() : $(`#form-complete-no-modal`).html(),
                                compiledTemplate = Template7.compile(template),
                                context = {
                                    formComplete: response.complete
                                },
                                html = compiledTemplate(context);

                            if(isModal) {
                                $('.modal__content').empty();
                                $('.modal__content').html(html);
                            }
                            else {
                                $('[data-name="callback"] .section__inner').empty();
                                $('[data-name="callback"] .section__inner').html(html);
                            }
                        }
                    });
                },
                rules: {
                    name: {
                        required: true,
                        minlength: 3
                    },
                    phone: {
                        required: true,
                        PHONE: true
                    },
                    agreement: {
                        required: true
                    },
                    review: {
                        required: true,
                        minlength: 5
                    }
                },
                highlight: function( element ){
                    $(element).parent().addClass('error');
                },
                unhighlight: function( element ){
                    $(element).parent().removeClass('error');
                },
                errorPlacement: function(error, element) {
                    $(element).parent().after(error);
                },
                messages: {
                    name: {
                        required: 'Заполните имя',
                        minlength: 'Минимум 3 символа'
                    },
                    phone: {
                        required: 'Заполните номер телефона'
                    },
                    review: {
                        required: 'Заполните поле'
                    },
                    agreement: {
                        required: 'Согласитесь с условиями'
                    }
                },
                errorElement: 'div',
                errorClass: 'form-error'
            });
        });
    }

    validateForms();

    // Modal
    openModal = function(name, params) {
        let template = $(`#${name}`).html(),
            compiledTemplate = Template7.compile(template),
            context = params,
            html = compiledTemplate(context);
            console.log(params)

        $('.overlay, .modal').remove();
        $('body').addClass('popup-open').append(html);
        $('body').removeClass('swipe-open');
        $('.swipe').removeClass('swipe--opened');

        $('[data-name="phone"]').inputmask("mask", { "mask": phone, 'showMaskOnHover': false });

        filledInput();

        validateForms();
    }

    closeModal = () => {
        $('.overlay, .modal').remove();
        $('body').removeClass('popup-open');
    }
})