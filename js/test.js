'use strict';
$(document).ready(function () {
    var test = (function(){
        var badLinks, quantity, style, style_inline,
            //количество цен до и после на странице и блоков с валютой
            prise = {
                current: 0,
                previos:0,
                x_currency:0,
                blockSum: 0
            },
            errors = {
                'href':[],
                'styleTag':[],
                'styleInline':[]
            };


        function cl(text){
            console.log(text);
        }


        //обновим данные об ошибках в переменных
        function getCurrentData(){
            badLinks = $('a[href!=""]'),
                quantity = badLinks.length,
                style = $('style'),
                style_inline = $('*[style]'),
                prise = {
                    current: $('.x_price_current').length,
                    previos:$('.x_price_previos').length,
                    x_currency:$('.x_currency').length,
                    blockSum: $('.x_price_current').length + $('.x_price_previos').length + $('.x_currency').length
                },
                errors = {
                    'href':[],
                    'styleTag':[],
                    'styleInline':[]
                };
        }
        getCurrentData();

        //дабавляет кнопки управления на верх страницы
        function addPopup(){
            var popUp = $(
                '<div id="testPopUp" style="background-color: #ccc; text-align: center; width: 100%; overflow: hidden; z-index: 1000; position: relative">'+
                '<button class="test_clean_select" style="border-radius: 8px; display: inline-block; width: 45%; margin: 5px;"">Очистить href выборочно</button>'+
                '<button class="test_clean" style="border-radius: 8px; display: inline-block; width: 45%; margin: 5px;"">Очистить href у всех ссылок</button>'+
                '<button class="test_getInline" style="border-radius: 8px; display: inline-block; width: 45%; margin: 5px;"">Вытянуть инлайновые стили</button>'+
                '<button class="test_form_correction" style="border-radius: 8px; display: inline-block; width: 45%; margin: 5px;"">Исправить атрибуты форм и полей ввода</button>'+
                '<button class="test_getHtml" style="border-radius: 8px; display: block; width: 91%; margin: 5px auto;"">Получить html тега body</button>'+
                '</div>'
            );
            $('body').prepend(popUp);
        }
        addPopup();


        function styleTest(){
            getCurrentData();

            for (var i = 0; i<style_inline.length; i++) {
                var cur = style_inline[i];
                //если это не стили нашего попапа
                if (!$(cur).closest('#testPopUp').length>0) {
                    errors.styleInline.push($(cur));
                }

            }
            if (errors.styleInline.length>0) {
                cl('Найдено элементов с инлайновыми стилями '+errors.styleInline.length);
                //cl(errors.styleInline);
            }else{cl('Все инлайновые стили перемещены. Ураааааа!!!!!!!');}
            if (style.length>0) {
                cl('На странице найден тег <style></style> в количестве '+style.length+', вероятно используються встроенные стили.');
            }else{cl('Тегов style не обнаружено');}
        }


        function priceTest(){
            if (prise.blockSum>0) {
                if (prise.current === prise.previos) {
                    if (prise.current + prise.previos === prise.x_currency) {
                        cl('Судя по всему блоки с ценами у вас в норме. \n- количество каждого из блоков, текущая. '+prise.current+' предидущая '+ prise.previos+' валюта '+prise.x_currency);
                    }else{
                        cl('Сумма блоков с ценами отличаеться от количества блоков с валютой, что то здесь не так)\n- количество каждого из блоков, текущая '+prise.current+' предидущая '+ prise.previos+' валюта '+prise.x_currency);
                    }
                }else{
                    cl('Количество блоков с ценой до и после не совпадает, это немного странно).\n- количество каждого из блоков, текущая: '+prise.current+', предидущая: '+ prise.previos+', валюта: '+prise.x_currency);
                }
            }else{
                cl('Не проставлены классы для блоков валюты а также для цен до и после, но если это транзитка то всё норм)');
            }
        }


        function hrefTest(){
            for (var i=0; i<quantity; i++) {
                var current = badLinks[i];
                errors.href.push($(current).attr('href'));
            }
            if (errors.href.length>0) {
                cl('Найдено не очищеных ссылок '+quantity);
                cl('Возможно данные ссылки нужно удалить: '+errors.href);
            }else{cl('Все ссылки очищены. Ураааааа!!!!!!!');}
        }


        //тест атрибутов форм и полей а также истправление всего єтого, если надо
        function formTest(change){
            var
                form = $('form'),
                errors = [];

            if (!form.length>0) {
                cl('на странице не обнаружено ни одной формы');
                return;
            }else{cl('Обнаружено формы, в количестве: '+form.length);}


            for (var i=0; i<form.length; i++) {
                var
                    current = form[i],
                    counter = i+1,
                    metod = $(current).attr('method') === 'post',
                    hasClass = $(current).hasClass('x_order_form'),
                    action =  $(current).attr('action') === '/submit',
                    errorNumber = function(){return errors.length +1;};

                //исправим ошибки если это нужно и если они есть
                if (!metod && change) {
                    $(current).attr('method', 'post');
                    metod = !metod;
                }
                if (!hasClass && change) {
                    $(current).addClass('x_order_form');
                    hasClass = !hasClass;
                }
                if (!action && change) {
                    $(current).attr('action', '/submit');
                    action = !action;
                }

                if (!metod) {errors.push(errorNumber()+') необходим метод отправки формы: method ="POST" ');}
                if (!hasClass) { errors.push(errorNumber()+') Форме необходимо задать класс: x_order_form');}
                if (!action) { errors.push(errorNumber()+') Форме необходимо задать атрибут: action="/submit" ');}

                cl('  ИНФОРМАЦИЯ ПО ФОРМЕ №'+counter);
                //возьмем все поля ввода данной формы и проверим
                var
                    inputList = ( $(current).find('input') ),
                    nameName = $(inputList[0]).attr('name') === 'name',
                    namePhone = $(inputList[1]).attr('name') === 'phone',
                    countrySelect = $(current).find('.x_country_select'),
                    inputCount = $(current).find('input').length === 2;


                if (inputList.length<1) {
                    cl('В форме номер '+counter+' нет ни одного поля ввода');
                    continue;
                }
                if (!nameName && change) {
                    $(inputList[0]).attr('name', 'name');
                    nameName = !nameName;
                }
                if (!namePhone && change) {
                    $(inputList[1]).attr('name', 'phone');
                    namePhone = !namePhone;
                }

                if (!nameName) {errors.push(errorNumber()+') отсутствует атрибут name="name" у поля для ввода имени');}
                if (!namePhone) {errors.push(errorNumber()+') отсутствует атрибут name="phone" у поля для ввода телефона');}
                if (!countrySelect.length>0) {errors.push(errorNumber()+') нет блока с класом .x_country_select');}
                if (!inputCount) {errors.push(errorNumber()+') в каждой форме должно быть 2 поля ввода');}
                if (errors.length>0) {
                    cl('В форме номер '+counter+' обнаружены ошибки: '+errors.length+'шт. \n'+ errors.join('  \n'));
                }else{
                    cl('В форме номер '+counter+' ошибок не обнаружено\n'+ errors.join('  \n'));
                }

                //обнулим массив с ошибками перед проверкой следующей формы
                errors = [];
            }
            if (change) {mainTest();}
        }


        //удалить не очищеные ссылки
        function hrefRemove(data){
            if (!data) {
                for (var i=0; i<quantity; i++) {
                    $(badLinks[i]).attr('href', '');
                }
            }else{

                for (var i1=0; i1<quantity; i1++) {
                    var href = $(badLinks[i1]).attr('href');
                    //если это ссылка не на приватность и это не якорь
                    if (href !== undefined) {
                        if (href==='privacy.html' || href.search('^#.')!== -1) {
                            continue;
                        }
                        $(badLinks[i1]).attr('href', '');
                    }else{
                        $(badLinks[i1]).attr('href', '');
                    }

                }
            }
            getCurrentData();
        }


        //заменит содержимое странички на html код этой же страницы
        function getHtml(){
            $('div').remove('#testPopUp');

            var
                domHtml = $('html').html(),
                showHtml = $('<div id="showHtml" style="position: absolute;width: 100vw;height: 100vh; background-color: #fff; z-index: 10000; overflow: scroll; "><pre id="showHtmlText"></pre></div>');

            $('body').remove();
            addPopup();

            $('html').append(showHtml);
            $('#showHtmlText').text('<!DOCTYPE html>\n<html>\n  '+domHtml+'\n<html>');

        }


        // function newClass(){
        //     var mask = 'inL_';
        //     return mask+Math.round(Math.random()*(1000000 - 1) + 1);
        // }

        var classNameNumber = 0

        function newClass(){
            var mask = 'inL_';
            var className = mask + classNameNumber;
            classNameNumber++;
            return className;
        }

        //вытянуть все инлайновые стили
        function getInlineStyle(){
            var
                allItems = $('*'),
                styleBox = [];  //массив обектов для хранения стилей

            for (var i = 0; i<allItems.length; i++) {
                var item = $(allItems[i]);
                var currentStyles = item.attr('style');

                //если у текущего елемента имеються стили и это не детки нашего попапа то работаем с ним
                if (currentStyles !== undefined && !item.closest('#testPopUp').length>0) {
                    //удалим инлайновые стили вместе с атрибутами
                    item.removeAttr('style');
                    var itemClass = newClass();
                    item.addClass(itemClass);
                    var obj = {
                        className:itemClass,
                        style:currentStyles
                    };
                    styleBox.push(obj);
                }
            }
            addStyleToPage(styleBox);
        }


        //добавить стили на страницу в отдельном теге style
        function addStyleToPage(styleBox){
            var styleText = '\n';
            for (var i = 0; i<styleBox.length; i++) {
                styleText += '.'+styleBox[i].className+'.'+styleBox[i].className+'{'+styleBox[i].style+'}\n';
            }
            styleText = '\n<style>'+styleText+'</style>';
            $('body').prepend(styleText);
            //cl(styleText);
        }


        //обработка кликов по нашему тестовому попапу
        $('#testPopUp').click(function(evt){
            var curElement = evt.target;

            if (curElement.className === 'test_clean') {
                hrefRemove();
                mainTest();
            }
            if (curElement.className === 'test_clean_select') {
                hrefRemove(true);
                mainTest();
            }if (curElement.className === 'test_getHtml') {
                getHtml();
            }if(curElement.className === 'test_getInline'){
                getInlineStyle();
                mainTest();
                return;
            }if(curElement.className === 'test_form_correction'){
                formTest(true);
                mainTest();
                return;
            }

        });


        //тестирует страничку по всем пунктам
        function mainTest(){
            console.clear();
            cl('>>>START NEW TEST<<<');
            cl('     --- ССЫЛКИ ---');
            hrefTest(false);
            cl('     --- СТИЛИ ---');
            styleTest();
            cl('     --- ЦЕНЫ ---');
            priceTest();
            cl('     --- ФОРМЫ ---');
            formTest(false);

        }
        mainTest();


    });
    test();


    // $(document).ready(function(){
    //   var wrapperWidth = $('.wrapper').width();
    //   console.log(wrapperWidth);
    //   var allElements = $('*');
    //   for (var i = 0; i < allElements.length; i++) {
    //     var itemLength = $(allElements[i]).width();
    //     if (itemLength>wrapperWidth && !$(allElements[i]).hasClass('owl-stage')) {
    //       // $(allElements[i]).width(wrapperWidth);
    //       console.log($(allElements[i]).attr('class'));
    //     }
    //   }
    // });
});