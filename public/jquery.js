$( () => {

  // NAV
  const $menu = $('.menu');
  const $main = $('main');
  const $navIcon = $('.nav_icon');
  const $burgOne = $('.burg1');
  const $burgTwo = $('.burg2');
  const $burgThree = $('.burg3');

  // NAV
  const openNav = () => {
    $menu.toggleClass('open');
    $burgOne.toggleClass('close');
    $burgTwo.toggleClass('close');
    $burgThree.toggleClass('close');
    $main.toggleClass('smaller');
  }

  //  NAV
  $navIcon.on('click', openNav)

}); // ENDS ONLOAD
