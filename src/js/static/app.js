
// mask
Inputmask({'mask': '9', repeat: 4 }).mask('.year'); //год выпуска авто
Inputmask({
  alias: 'decimal',
  radixPoint: '.',
  integerDigits: 3,
  rightAlign: false,
  digits: 2,
  placeholder: ''
}).mask('.engine-volume'); //объем двигателя



/////////mobile menu
$('.menu-open').on('click', function() {
  $(this).toggleClass('active');
  $('.menu').toggleClass('active');
  $('body').toggleClass('hidden');
});


/////////в форме label сьезжает
$('.form__input input, .form__input textarea').on('focus', function() {
  $(this).next('span').addClass('active');
});
$('.form__input input, .form__input textarea').on('blur', function() {
  if($(this).val() === '') {
    $(this).next('span').removeClass('active');
  }
});



/////////login page
//переключение логина и ввосстановления пароля
$('.login__authorization .forgot-password').on('click', function(e) {
  e.preventDefault();
  var btn = $(this);
  btn.parents('.login__authorization').fadeOut(300);
  setTimeout(function() {
    btn.parents('.login__authorization').next('.login__recovery').fadeIn(300);
  }, 300);
}); 
$('.login__recovery .remembered-password').on('click', function(e) {
  e.preventDefault();
  var btn = $(this);
  btn.parents('.login__recovery').fadeOut(300);
  setTimeout(function() {
    btn.parents('.login__recovery').prev('.login__authorization').fadeIn(300);
  }, 300);
}); 
$('.password__btn').on('click', function() {
  $(this).toggleClass('not');
  if ($(this).hasClass('not')) {
    $(this).siblings('input').attr('type', 'text');
  } else {
    $(this).siblings('input').attr('type', 'password');
  }
});
//кнопка восстановить, отправка email
$('.login__recovery .btn').on('click', function(e) {
  e.preventDefault();
  var mail = $('.recovery-mail');
  var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.[a-z]{2,6}$/i;
  if(mail.val() !== '' && mail.val().search(pattern) === 0) {
    mail.removeClass('error');
    var btn = $(this);
    btn.parents('.login__recovery').fadeOut(300);
    setTimeout(function() {
      btn.parents('.login__recovery').next('.login__done').fadeIn(300);
      $('.login__done p span').text(mail.val());
    }, 300);
  } else{
    mail.addClass('error');
  }
}); 
//return login
$('.login__done .btn').on('click', function(e) {
  e.preventDefault();
  var btn = $(this);
  btn.parents('.login__done').fadeOut(300);
  setTimeout(function() {
    btn.parents('.login__done').siblings('.login__authorization').fadeIn(300);
  }, 300);
}); 




/////////Documents page
// tabs
$('ul.tabs__caption').on('click', 'li:not(.active)', function() {
  $(this).addClass('active').siblings().removeClass('active')
    .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
});
// tabs mobile
$('.tabs-mobile span').on('click', function() {
  $(this).toggleClass('active').next().slideToggle();
});
if($(document).width() <= 992) {
  $('.tabs-mobile .tabs__caption li').on('click', function() {
    $('.tabs-mobile span').removeClass('active').find('b').text($(this).text());
    $(this).closest('.tabs__caption').slideToggle();
  });
}


/////////Auto page
//dropdown
if($(document).width() >= 992) {
  $('.filter-title').on('click', function() {
    $(this).toggleClass('active');
    $(this).next().slideToggle();
    $(this).parents('.filter').siblings().find('.filter-title').removeClass('active').next().slideUp();
  });
} else{
  $('.filter-title').on('click', function() {
    $('.popup-filter').fadeIn();
    $('.popup-filter .filter-dropdown').html($(this).next().html());
    var myDatepicker = $('.popup-filter .datepicker-filter').datepicker().data('datepicker');
    if(myDatepicker !== undefined) {
      myDatepicker.update({
        onSelect(formattedDate, date, inst) {
          $('#date span').text(formattedDate);
        }
      });
    }
  });
}
//check filter
$('body').on('click', '.filter-dropdown li', function() {
  $(this).addClass('active').siblings().removeClass('active');
  if($(document).width() >= 992) {
    $(this).parents('.filter').find('.filter-title').removeClass('active').find('span').text($(this).text());
    $(this).parents('.filter').find('.filter-title span').attr('data-id', $(this).attr('data-id'));
    $(this).parents('.filter-dropdown').slideToggle();
  } else{
    $(this).closest('ul').next().attr('data-id', $(this).attr('data-id'));
    $(this).closest('ul').next().attr('data-text', $(this).text());
  }
  activeFilters();
});
//клик вне фильтра
$(document).mouseup(function(e) {
  var div = $('.filter'); 
  if (!div.is(e.target)
      && div.has(e.target).length === 0) {
    div.find('.filter-title').removeClass('active').next().slideUp();;
  }
});
//datepicker
$('.datepicker-filter').datepicker({
  onSelect(formattedDate, date, inst) {
    $('#date span').text(formattedDate);
    activeFilters();
  }
});
////mobile
//btn open filter mobile
$('.auto__filters__mobile').on('click', function() {
  $(this).next().slideToggle();
}); 
//check filter
$('body').on('click', '.popup-filter .btn', function(e) {
  e.preventDefault();
  var id = $(this).attr('data-id');
  var text = $(this).attr('data-text');
  var elId = $(this).attr('href');
  $(elId).find('span').text(text).attr('data-id', id);
  if(elId !== '#date') {
    $(elId).next().html($('.popup-filter .filter-dropdown').html());
  }
  $('.popup-filter').fadeOut().find('.filter-dropdown').html('');
});
// close filter Применение фильтров
$('.auto__row .btn-mobile').on('click', function(e) {
  e.preventDefault();
  $(this).closest('.auto__row').slideToggle();
  activeFilters();
});

//блок выбранных фильтров
$('body').on('click', '.auto__check-filters .icon-close', function() {
  var remove = $(this).closest('li').attr('data-id');
  $('.auto__filters__block').each(function(index, item) {
    if(+remove === index) {
      if($(item).hasClass('filter--date')) {
        $(item).find('p span').text('--.--.----');
      } else{
        $(item).find('p span').attr('data-id', '0').text($(item).find('p').attr('data-name'));
      }
    }
  });
  activeFilters();
});


function activeFilters() {
  var activeFilters = '';
  $('.auto__filters__block').each(function(index, item) {
    if($(item).hasClass('auto__filters__block--search')) {
    } else{
      var name = $(item).find('[data-name]').attr('data-name');
      var value = $(item).find('p span').text();
      if($(item).find('p span').attr('data-id') !== '0' && value !== '--.--.----') {
        activeFilters += '<li data-id="'+ index +'"><p>'+ name +': '+ value +'</p><i class="icon icon-close"> </i></li>';
      }
    }
  });
  if(activeFilters !== '') {
    $('.auto__filters__mobile').addClass('active');
  } else{
    $('.auto__filters__mobile').removeClass('active');
  }
  $('.auto__check-filters').html(activeFilters);
}



/////////popup orders
//open all popup
$('body').on('click', '[data-popup]', function() {
  var id = $(this).attr('data-popup');
  if(id === '#orders') {
    $('.popup_bg').fadeIn();
    $(id).addClass('active');
  } else{
    $('.popup__bg-mini').fadeIn();
    $(id).fadeIn();
  }
});
$('body').on('click', '.popup_bg, .popup-orders__header a', function(e) {
  e.preventDefault();
  $('.popup_bg').fadeOut();
  $('.popup-orders').removeClass('active');
});

////popup all
$('body').on('click', '.popup__bg-mini, .popup__close', function(e) {
  e.preventDefault();
  $('.popup__bg-mini').fadeOut();
  $('.popup').fadeOut();
});
//popup close invoice
$('body').on('click', '.close-popup', function(e) {
  e.preventDefault();
  $('.popup__bg-mini').fadeOut();
  $('.popup').fadeOut();
  var btn = $(this);
  setTimeout(function() {
    $(btn).closest('.popup-invoice__done, .popup-bell__done').slideUp().prev().slideDown();
  }, 400);
});
//send form
$('body').on('click', '.popup .form button', function(e) {
  e.preventDefault();
  $(this).closest('.popup-invoice__form').slideUp().next().slideDown();
});

$('.popup-orders__count .btn-look').on('click', function() {
  $(this).toggleClass('not').closest('tr').toggleClass('border').next('.info').toggleClass('active');
});


////popup-calculator
//datepicker
$('.datepicker-year').datepicker({
  offset: 25,
  toggleSelected: false,
  autoClose: true
});
$('body').on('click', '.popup-calculator__step1 .btn', function(e) {
  e.preventDefault();
  $(this).closest('.popup-calculator__step1').slideUp().next().slideDown();
});
$('body').on('click', '.popup-calculator__step2 .btn', function(e) {
  e.preventDefault();
  $(this).closest('.popup-calculator__step2').slideUp().prev().slideDown();
});

$('.select-calculator').selectize({
  sortField: 'text',
});


/////bell popup
$('body').on('click', '.popup .form button', function(e) {
  e.preventDefault();
  $(this).closest('.popup-bell__form').slideUp().next().slideDown();
});
